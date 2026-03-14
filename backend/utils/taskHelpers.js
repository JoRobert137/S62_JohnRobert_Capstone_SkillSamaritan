/**
 * Task Helper Functions
 * Reusable utility functions for task validation, authorization, and points management
 * Used across multiple controllers to maintain consistent business logic
 */

/**
 * Check if a task can transition from current status to target status
 * Valid transitions:
 * - open -> accepted
 * - accepted -> completed
 * No other transitions allowed
 *
 * @param {string} currentStatus - Current task status ("open", "accepted", "completed")
 * @param {string} targetStatus - Desired target status
 * @returns {Object} { canTransition: boolean, reason?: string }
 */
exports.canTransitionTask = (currentStatus, targetStatus) => {
  const validTransitions = {
    open: ["accepted"],
    accepted: ["completed"],
    completed: [], // Terminal state
  };

  if (!validTransitions[currentStatus]) {
    return {
      canTransition: false,
      reason: `Unknown task status: "${currentStatus}"`,
    };
  }

  if (!validTransitions[currentStatus].includes(targetStatus)) {
    const allowed = validTransitions[currentStatus].length > 0
      ? validTransitions[currentStatus].join(", ")
      : "none (task is complete)";

    return {
      canTransition: false,
      reason: `Task status is "${currentStatus}". Valid transition(s): ${allowed}`,
      currentStatus,
      allowedTransitions: validTransitions[currentStatus],
    };
  }

  return { canTransition: true };
};

/**
 * Check if user is authorized to perform an action on a task
 * Different actions require different permissions
 *
 * @param {Object} user - User document (contains _id)
 * @param {Object} task - Task document (contains createdBy, acceptedBy)
 * @param {string} action - Action to perform ("accept", "complete", "create")
 * @returns {Object} { isAuthorized: boolean, reason?: string }
 */
exports.canUserPerformAction = (user, task, action) => {
  if (!user) {
    return { isAuthorized: false, reason: "User not authenticated" };
  }

  if (!task) {
    return { isAuthorized: false, reason: "Task not found" };
  }

  const userId = user._id.toString();
  const creatorId = task.createdBy.toString();
  const helperId = task.acceptedBy ? task.acceptedBy.toString() : null;

  // Action-specific authorization checks
  switch (action) {
    case "accept":
      // Only non-creator can accept
      if (userId === creatorId) {
        return {
          isAuthorized: false,
          reason: "Task creator cannot accept their own task",
        };
      }
      // Cannot accept if already accepted
      if (task.acceptedBy) {
        return {
          isAuthorized: false,
          reason: "Task has already been accepted by another user",
        };
      }
      return { isAuthorized: true };

    case "complete":
      // Only creator can mark as complete
      if (userId !== creatorId) {
        return {
          isAuthorized: false,
          reason: "Only task creator can mark task as completed",
        };
      }
      return { isAuthorized: true };

    case "create":
      // Only authenticated users, handled at endpoint level
      return { isAuthorized: true };

    case "view":
      // Public tasks are viewable by anyone
      return { isAuthorized: true };

    case "edit":
      // Only creator can edit (future feature)
      if (userId !== creatorId) {
        return {
          isAuthorized: false,
          reason: "Only task creator can edit this task",
        };
      }
      return { isAuthorized: true };

    case "cancel":
      // Only creator can cancel open tasks
      if (userId !== creatorId) {
        return {
          isAuthorized: false,
          reason: "Only task creator can cancel this task",
        };
      }
      if (task.status !== "open") {
        return {
          isAuthorized: false,
          reason: "Can only cancel tasks in 'open' status",
        };
      }
      return { isAuthorized: true };

    default:
      return {
        isAuthorized: false,
        reason: `Unknown action: "${action}"`,
      };
  }
};

/**
 * Check if user has sufficient points balance
 *
 * @param {Object} user - User document (contains points)
 * @param {number} pointsNeeded - Points required
 * @returns {Object} { hasSufficient: boolean, deficit?: number, message?: string }
 */
exports.hasSufficientPoints = (user, pointsNeeded) => {
  if (!user) {
    return { hasSufficient: false, message: "User not found" };
  }

  if (typeof user.points !== "number") {
    return {
      hasSufficient: false,
      message: "Invalid user points balance",
    };
  }

  if (user.points >= pointsNeeded) {
    return {
      hasSufficient: true,
      available: user.points,
      required: pointsNeeded,
    };
  }

  const deficit = pointsNeeded - user.points;
  return {
    hasSufficient: false,
    deficit,
    available: user.points,
    required: pointsNeeded,
    message: `Insufficient points. You have ${user.points} points but need ${pointsNeeded} (deficit: ${deficit})`,
  };
};

/**
 * Check if user is the task creator
 *
 * @param {Object} user - User document
 * @param {Object} task - Task document
 * @returns {boolean}
 */
exports.isTaskCreator = (user, task) => {
  if (!user || !task) return false;
  return user._id.toString() === task.createdBy.toString();
};

/**
 * Check if user is the task helper (accepted the task)
 *
 * @param {Object} user - User document
 * @param {Object} task - Task document
 * @returns {boolean}
 */
exports.isTaskHelper = (user, task) => {
  if (!user || !task || !task.acceptedBy) return false;
  return user._id.toString() === task.acceptedBy.toString();
};

/**
 * Get task status description for user-friendly messages
 *
 * @param {string} status - Task status
 * @returns {string} Human-readable description
 */
exports.getTaskStatusDescription = (status) => {
  const descriptions = {
    open: "Open - Waiting for someone to accept",
    accepted: "In Progress - Helper is working on it",
    completed: "Completed - Task finished and points transferred",
  };

  return descriptions[status] || `Unknown status: ${status}`;
};

/**
 * Calculate points that will be available after completing a task
 * Used for UI display to show what user will earn/spend
 *
 * @param {Object} user - User document
 * @param {Object} task - Task document
 * @param {string} userRole - "creator" or "helper"
 * @returns {Object} { currentBalance, afterCompletion, change, changeType }
 */
exports.simulatePointsAfterCompletion = (user, task, userRole) => {
  if (!user || !task) return null;

  const pointsValue = task.points;
  const currentBalance = user.points;
  let change = 0;
  let changeType = "none";

  if (userRole === "creator") {
    change = -pointsValue;
    changeType = "deduct";
  } else if (userRole === "helper") {
    change = pointsValue;
    changeType = "earn";
  }

  return {
    currentBalance,
    afterCompletion: currentBalance + change,
    change: Math.abs(change),
    changeType,
    taskPoints: pointsValue,
  };
};

/**
 * Validate multiple authorization and points checks at once
 * Useful for complex operations that require multiple validations
 *
 * @param {Object} checks - Object with checks to perform
 * @param {Object} checks.user - User document (optional, only validate if provided)
 * @param {Object} checks.task - Task document (optional)
 * @param {string} checks.action - Action to authorize (optional)
 * @param {number} checks.pointsNeeded - Points to check (optional)
 * @returns {Object} { allValid: boolean, errors: Array, warnings: Array }
 */
exports.validateMultiple = (checks) => {
  const errors = [];
  const warnings = [];

  // Check user authorization for action
  if (checks.action && checks.user && checks.task) {
    const authCheck = exports.canUserPerformAction(
      checks.user,
      checks.task,
      checks.action
    );
    if (!authCheck.isAuthorized) {
      errors.push({
        type: "authorization",
        message: authCheck.reason,
        action: checks.action,
      });
    }
  }

  // Check points sufficiency
  if (checks.pointsNeeded !== undefined && checks.user) {
    const pointsCheck = exports.hasSufficientPoints(
      checks.user,
      checks.pointsNeeded
    );
    if (!pointsCheck.hasSufficient) {
      errors.push({
        type: "insufficient_points",
        message: pointsCheck.message,
        deficit: pointsCheck.deficit,
      });
    }
  }

  // Check task status transition
  if (checks.currentStatus && checks.targetStatus) {
    const transitionCheck = exports.canTransitionTask(
      checks.currentStatus,
      checks.targetStatus
    );
    if (!transitionCheck.canTransition) {
      errors.push({
        type: "invalid_transition",
        message: transitionCheck.reason,
        currentStatus: checks.currentStatus,
        targetStatus: checks.targetStatus,
      });
    }
  }

  return {
    allValid: errors.length === 0,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
  };
};

/**
 * Format authorization error for API response
 *
 * @param {Object} authResult - Result from canUserPerformAction
 * @param {string} action - Action that was denied
 * @returns {Object} Formatted error object for HTTP response
 */
exports.formatAuthorizationError = (authResult, action) => {
  return {
    statusCode: 403,
    message: authResult.reason || `Unauthorized to perform action: ${action}`,
    action,
    code: "AUTHORIZATION_DENIED",
  };
};

/**
 * Format points error for API response
 *
 * @param {Object} pointsResult - Result from hasSufficientPoints
 * @returns {Object} Formatted error object for HTTP response
 */
exports.formatPointsError = (pointsResult) => {
  return {
    statusCode: 400,
    message: pointsResult.message,
    available: pointsResult.available,
    required: pointsResult.required,
    deficit: pointsResult.deficit,
    code: "INSUFFICIENT_POINTS",
  };
};
