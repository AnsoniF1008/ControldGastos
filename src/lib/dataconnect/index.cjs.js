const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'controldgastos-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const getHouseholdForMeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetHouseholdForMe');
}
getHouseholdForMeRef.operationName = 'GetHouseholdForMe';
exports.getHouseholdForMeRef = getHouseholdForMeRef;

exports.getHouseholdForMe = function getHouseholdForMe(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getHouseholdForMeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const registerHouseholdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterHousehold', inputVars);
}
registerHouseholdRef.operationName = 'RegisterHousehold';
exports.registerHouseholdRef = registerHouseholdRef;

exports.registerHousehold = function registerHousehold(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registerHouseholdRef(dcInstance, inputVars));
}
;

const addHouseholdMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddHouseholdMember', inputVars);
}
addHouseholdMemberRef.operationName = 'AddHouseholdMember';
exports.addHouseholdMemberRef = addHouseholdMemberRef;

exports.addHouseholdMember = function addHouseholdMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addHouseholdMemberRef(dcInstance, inputVars));
}
;

const updateHouseholdMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateHouseholdMember', inputVars);
}
updateHouseholdMemberRef.operationName = 'UpdateHouseholdMember';
exports.updateHouseholdMemberRef = updateHouseholdMemberRef;

exports.updateHouseholdMember = function updateHouseholdMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateHouseholdMemberRef(dcInstance, inputVars));
}
;

const deleteHouseholdMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteHouseholdMember', inputVars);
}
deleteHouseholdMemberRef.operationName = 'DeleteHouseholdMember';
exports.deleteHouseholdMemberRef = deleteHouseholdMemberRef;

exports.deleteHouseholdMember = function deleteHouseholdMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteHouseholdMemberRef(dcInstance, inputVars));
}
;

const updateUserBudgetsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserBudgets', inputVars);
}
updateUserBudgetsRef.operationName = 'UpdateUserBudgets';
exports.updateUserBudgetsRef = updateUserBudgetsRef;

exports.updateUserBudgets = function updateUserBudgets(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserBudgetsRef(dcInstance, inputVars));
}
;

const insertExpenseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertExpense', inputVars);
}
insertExpenseRef.operationName = 'InsertExpense';
exports.insertExpenseRef = insertExpenseRef;

exports.insertExpense = function insertExpense(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertExpenseRef(dcInstance, inputVars));
}
;

const updateExpenseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateExpense', inputVars);
}
updateExpenseRef.operationName = 'UpdateExpense';
exports.updateExpenseRef = updateExpenseRef;

exports.updateExpense = function updateExpense(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateExpenseRef(dcInstance, inputVars));
}
;

const deleteExpenseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteExpense', inputVars);
}
deleteExpenseRef.operationName = 'DeleteExpense';
exports.deleteExpenseRef = deleteExpenseRef;

exports.deleteExpense = function deleteExpense(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteExpenseRef(dcInstance, inputVars));
}
;

const insertIncomeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertIncome', inputVars);
}
insertIncomeRef.operationName = 'InsertIncome';
exports.insertIncomeRef = insertIncomeRef;

exports.insertIncome = function insertIncome(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertIncomeRef(dcInstance, inputVars));
}
;

const updateIncomeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIncome', inputVars);
}
updateIncomeRef.operationName = 'UpdateIncome';
exports.updateIncomeRef = updateIncomeRef;

exports.updateIncome = function updateIncome(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateIncomeRef(dcInstance, inputVars));
}
;

const deleteIncomeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIncome', inputVars);
}
deleteIncomeRef.operationName = 'DeleteIncome';
exports.deleteIncomeRef = deleteIncomeRef;

exports.deleteIncome = function deleteIncome(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIncomeRef(dcInstance, inputVars));
}
;

const insertCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertCard', inputVars);
}
insertCardRef.operationName = 'InsertCard';
exports.insertCardRef = insertCardRef;

exports.insertCard = function insertCard(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertCardRef(dcInstance, inputVars));
}
;

const updateCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCard', inputVars);
}
updateCardRef.operationName = 'UpdateCard';
exports.updateCardRef = updateCardRef;

exports.updateCard = function updateCard(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCardRef(dcInstance, inputVars));
}
;

const deleteCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCard', inputVars);
}
deleteCardRef.operationName = 'DeleteCard';
exports.deleteCardRef = deleteCardRef;

exports.deleteCard = function deleteCard(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteCardRef(dcInstance, inputVars));
}
;

const insertGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertGoal', inputVars);
}
insertGoalRef.operationName = 'InsertGoal';
exports.insertGoalRef = insertGoalRef;

exports.insertGoal = function insertGoal(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertGoalRef(dcInstance, inputVars));
}
;

const updateGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGoal', inputVars);
}
updateGoalRef.operationName = 'UpdateGoal';
exports.updateGoalRef = updateGoalRef;

exports.updateGoal = function updateGoal(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGoalRef(dcInstance, inputVars));
}
;

const updateGoalSavedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGoalSaved', inputVars);
}
updateGoalSavedRef.operationName = 'UpdateGoalSaved';
exports.updateGoalSavedRef = updateGoalSavedRef;

exports.updateGoalSaved = function updateGoalSaved(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGoalSavedRef(dcInstance, inputVars));
}
;

const deleteGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGoal', inputVars);
}
deleteGoalRef.operationName = 'DeleteGoal';
exports.deleteGoalRef = deleteGoalRef;

exports.deleteGoal = function deleteGoal(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGoalRef(dcInstance, inputVars));
}
;

const insertMonthHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertMonthHistory', inputVars);
}
insertMonthHistoryRef.operationName = 'InsertMonthHistory';
exports.insertMonthHistoryRef = insertMonthHistoryRef;

exports.insertMonthHistory = function insertMonthHistory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertMonthHistoryRef(dcInstance, inputVars));
}
;

const resetUserExpensesPaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetUserExpensesPaid', inputVars);
}
resetUserExpensesPaidRef.operationName = 'ResetUserExpensesPaid';
exports.resetUserExpensesPaidRef = resetUserExpensesPaidRef;

exports.resetUserExpensesPaid = function resetUserExpensesPaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(resetUserExpensesPaidRef(dcInstance, inputVars));
}
;

const resetUserIncomesReceivedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetUserIncomesReceived', inputVars);
}
resetUserIncomesReceivedRef.operationName = 'ResetUserIncomesReceived';
exports.resetUserIncomesReceivedRef = resetUserIncomesReceivedRef;

exports.resetUserIncomesReceived = function resetUserIncomesReceived(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(resetUserIncomesReceivedRef(dcInstance, inputVars));
}
;

const resetUserCardsPaidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ResetUserCardsPaid', inputVars);
}
resetUserCardsPaidRef.operationName = 'ResetUserCardsPaid';
exports.resetUserCardsPaidRef = resetUserCardsPaidRef;

exports.resetUserCardsPaid = function resetUserCardsPaid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(resetUserCardsPaidRef(dcInstance, inputVars));
}
;
