const getBadgeFromEarnedPoints = (earnedPoints = 0) => {
  const safeEarnedPoints = Number.isFinite(earnedPoints) ? earnedPoints : 0;

  if (safeEarnedPoints >= 500) {
    return "Samaritan Pro";
  }

  if (safeEarnedPoints >= 100) {
    return "Contributor";
  }

  return "Beginner";
};

module.exports = {
  getBadgeFromEarnedPoints,
};
