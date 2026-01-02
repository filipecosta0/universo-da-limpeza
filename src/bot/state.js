const statesByUser = new Map();

function getUserState(userId) {
  return statesByUser.get(userId) || { stage: 'NEW' };
}

function setUserState(userId, nextState) {
  statesByUser.set(userId, nextState);
}

function clearUserState(userId) {
  statesByUser.delete(userId);
}

module.exports = {
  getUserState,
  setUserState,
  clearUserState
};
