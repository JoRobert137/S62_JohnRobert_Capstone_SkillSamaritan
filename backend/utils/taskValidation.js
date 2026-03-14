/**
 * Task State Transition Validation Utilities
 * Centralizes business logic for preventing invalid task state transitions
 */

/**
 * Validate task acceptance
 * Rules:
 * - Task must exist
 * - Task must be in "open" status
 * - Task creator cannot accept th
 * - Task cannot already be accepted
 *
 * @param {Object} task - The task document from DB
 * @param {Object} userId - The user attempting to accept (ObjectId)
 * @returns {Object} { isValid: boolean, error?: Object }
 */
exports.validateAcceptance = (task, userId) => {
  if (!task) {
    return {
      isValid: false,
      error: {
        statusCode: 404,
        message: "Task not found.",
      },
    };
  }

  if (task.status !== "open") {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: `Cannot accept task. Task status is "${task.status}". Only "open" tasks can be accepted.`,
        currentStatus: task.status,
      },
    };
  }

  if (task.createdBy.equals(userId)) {
    return {
      isValid: false,
      error: {
        statusCode: 403,
        message: "You cannot accept a task you created. Please ask another community member for help.",
      },
    };
  }

  if (task.acceptedBy) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: "This task has already been accepted by another user.",
        acceptedBy: task.acceptedBy,
      },
    };
  }

  return { isValid: true };
};

/**
 * Validate task completion
 * Rules:
 * - Task must exist
 * - Task must be in "accepted" status
 * - Only task creator can complete it
 * - Task must have a helper assigned
 * - Creator must have sufficient points balance
 *
 * @param {Object} task - The task document from DB
 * @param {Object} creator - The user attempting to complete (User document)
 * @returns {Object} { isValid: boolean, error?: Object }
 */
exports.validateCompletion = (task, creator) => {
  if (!task) {
    return {
      isValid: false,
      error: {
        statusCode: 404,
        message: "Task not found.",
      },
    };
  }

  if (task.status !== "accepted") {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: `Cannot complete task. Task status is "${task.status}". Only "accepted" tasks can be completed.`,
        currentStatus: task.status,
      },
    };
  }

  if (!task.createdBy.equals(creator._id)) {
    return {
      isValid: false,
      error: {
        statusCode: 403,
        message: "Only the task creator can mark this task as completed.",
      },
    };
  }

  if (!task.acceptedBy) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: "Cannot complete task without an assigned helper.",
      },
    };
  }

  if (creator.points < task.points) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: `Insufficient points balance. You have ${creator.points} points but need ${task.points} to complete this task.`,
        available: creator.points,
        required: task.points,
      },
    };
  }

  return { isValid: true };
};

/**
 * Validate task creation
 * Rules:
 * - Required fields must not be empty
 * - Points must be a valid non-negative number
 * - User must have sufficient balance
 *
 * @param {Object} data - Request body data { title, description, points, skillsRequired }
 * @param {Object} user - The user attempting to create (User document)
 * @returns {Object} { isValid: boolean, error?: Object }
 */
exports.validateCreation = (data, user) => {
  const { title, description, points } = data;

  if (!title || !description) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: "Title and description are required.",
      },
    };
  }

  const taskPoints = parseInt(points, 10);
  if (isNaN(taskPoints) || taskPoints < 0) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: "Points must be a valid non-negative number.",
      },
    };
  }

  if (user.points < taskPoints) {
    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: `Insufficient points. You have ${user.points} points but need ${taskPoints} points to create this task.`,
        available: user.points,
        required: taskPoints,
      },
    };
  }

  return { isValid: true };
};

/**
 * Get human-readable description of valid state transitions for a task
 *
 * @param {string} currentStatus - Current task status
 * @returns {string} Description of valid next states
 */
exports.getValidTransitions = (currentStatus) => {
  const transitions = {
    open: "Can be accepted by community members",
    accepted: "Can be marked as completed by task creator",
    completed: "Task is finished. No further transitions allowed.",
  };

  return transitions[currentStatus] || "Unknown status";
};
