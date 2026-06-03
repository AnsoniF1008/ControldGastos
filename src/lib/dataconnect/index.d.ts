import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddHouseholdMemberData {
  user_insert: User_Key;
}

export interface AddHouseholdMemberVariables {
  householdId: UUIDString;
  name: string;
  emoji: string;
  color: string;
  role: string;
  sortOrder: number;
}

export interface Card_Key {
  id: UUIDString;
  __typename?: 'Card_Key';
}

export interface DeleteCardData {
  card_delete?: Card_Key | null;
}

export interface DeleteCardVariables {
  householdId: UUIDString;
  cardId: UUIDString;
}

export interface DeleteExpenseData {
  expense_delete?: Expense_Key | null;
}

export interface DeleteExpenseVariables {
  householdId: UUIDString;
  expenseId: UUIDString;
}

export interface DeleteGoalData {
  goal_delete?: Goal_Key | null;
}

export interface DeleteGoalVariables {
  householdId: UUIDString;
  goalId: UUIDString;
}

export interface DeleteHouseholdMemberData {
  expense_deleteMany: number;
  income_deleteMany: number;
  card_deleteMany: number;
  goal_deleteMany: number;
  monthHistory_deleteMany: number;
  user_delete?: User_Key | null;
}

export interface DeleteHouseholdMemberVariables {
  householdId: UUIDString;
  userId: UUIDString;
}

export interface DeleteIncomeData {
  income_delete?: Income_Key | null;
}

export interface DeleteIncomeVariables {
  householdId: UUIDString;
  incomeId: UUIDString;
}

export interface Expense_Key {
  id: UUIDString;
  __typename?: 'Expense_Key';
}

export interface GetHouseholdForMeData {
  households: ({
    id: UUIDString;
    createdAt: TimestampString;
    ownerUid?: string | null;
    users_on_household: ({
      id: UUIDString;
      name: string;
      emoji: string;
      color: string;
      role: string;
      sortOrder: number;
      createdAt: TimestampString;
      budgets?: string | null;
      expenses_on_user: ({
        id: UUIDString;
        name: string;
        amount: number;
        frequency: string;
        category: string;
        paid: boolean;
        dueDay?: number | null;
        currency: string;
      } & Expense_Key)[];
        incomes_on_user: ({
          id: UUIDString;
          name: string;
          amount: number;
          frequency: string;
          category: string;
          received: boolean;
          currency: string;
        } & Income_Key)[];
          cards_on_user: ({
            id: UUIDString;
            name: string;
            brand: string;
            creditLimit: number;
            balance: number;
            minPayment: number;
            dueDay: number;
            paid: boolean;
            currency: string;
          } & Card_Key)[];
            goals_on_user: ({
              id: UUIDString;
              name: string;
              target: number;
              saved: number;
              monthly: number;
              emoji: string;
              color: string;
              currency: string;
            } & Goal_Key)[];
              monthHistories_on_user: ({
                id: UUIDString;
                month: number;
                year: number;
                totalExp: number;
                paidExp: number;
                totalInc: number;
                recvInc: number;
                totalDebt: number;
                createdAt: TimestampString;
              } & MonthHistory_Key)[];
    } & User_Key)[];
  } & Household_Key)[];
}

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface Household_Key {
  id: UUIDString;
  __typename?: 'Household_Key';
}

export interface Income_Key {
  id: UUIDString;
  __typename?: 'Income_Key';
}

export interface InsertCardData {
  card_insert: Card_Key;
}

export interface InsertCardVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  brand: string;
  creditLimit: number;
  balance: number;
  minPayment: number;
  dueDay: number;
  paid: boolean;
  currency: string;
}

export interface InsertExpenseData {
  expense_insert: Expense_Key;
}

export interface InsertExpenseVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  paid: boolean;
  dueDay?: number | null;
  currency: string;
}

export interface InsertGoalData {
  goal_insert: Goal_Key;
}

export interface InsertGoalVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  emoji: string;
  color: string;
  currency: string;
}

export interface InsertIncomeData {
  income_insert: Income_Key;
}

export interface InsertIncomeVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  received: boolean;
  currency: string;
}

export interface InsertMonthHistoryData {
  monthHistory_insert: MonthHistory_Key;
}

export interface InsertMonthHistoryVariables {
  householdId: UUIDString;
  userId: UUIDString;
  month: number;
  year: number;
  totalExp: number;
  paidExp: number;
  totalInc: number;
  recvInc: number;
  totalDebt: number;
}

export interface MonthHistory_Key {
  id: UUIDString;
  __typename?: 'MonthHistory_Key';
}

export interface RegisterHouseholdData {
  household_insert: Household_Key;
  user_insert: User_Key;
}

export interface RegisterHouseholdVariables {
  name: string;
  emoji: string;
  color: string;
}

export interface ResetUserCardsPaidData {
  card_updateMany: number;
}

export interface ResetUserCardsPaidVariables {
  householdId: UUIDString;
  userId: UUIDString;
}

export interface ResetUserExpensesPaidData {
  expense_updateMany: number;
}

export interface ResetUserExpensesPaidVariables {
  householdId: UUIDString;
  userId: UUIDString;
}

export interface ResetUserIncomesReceivedData {
  income_updateMany: number;
}

export interface ResetUserIncomesReceivedVariables {
  householdId: UUIDString;
  userId: UUIDString;
}

export interface UpdateCardData {
  card_update?: Card_Key | null;
}

export interface UpdateCardVariables {
  householdId: UUIDString;
  cardId: UUIDString;
  name: string;
  brand: string;
  creditLimit: number;
  balance: number;
  minPayment: number;
  dueDay: number;
  paid: boolean;
  currency: string;
}

export interface UpdateExpenseData {
  expense_update?: Expense_Key | null;
}

export interface UpdateExpenseVariables {
  householdId: UUIDString;
  expenseId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  paid: boolean;
  dueDay?: number | null;
  currency: string;
}

export interface UpdateGoalData {
  goal_update?: Goal_Key | null;
}

export interface UpdateGoalSavedData {
  goal_update?: Goal_Key | null;
}

export interface UpdateGoalSavedVariables {
  householdId: UUIDString;
  goalId: UUIDString;
  saved: number;
}

export interface UpdateGoalVariables {
  householdId: UUIDString;
  goalId: UUIDString;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  emoji: string;
  color: string;
  currency: string;
}

export interface UpdateHouseholdMemberData {
  user_update?: User_Key | null;
}

export interface UpdateHouseholdMemberVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  emoji: string;
  color: string;
  role: string;
}

export interface UpdateIncomeData {
  income_update?: Income_Key | null;
}

export interface UpdateIncomeVariables {
  householdId: UUIDString;
  incomeId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  received: boolean;
  currency: string;
}

export interface UpdateUserBudgetsData {
  user_update?: User_Key | null;
}

export interface UpdateUserBudgetsVariables {
  userId: UUIDString;
  householdId: UUIDString;
  budgets: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface GetHouseholdForMeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetHouseholdForMeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetHouseholdForMeData, undefined>;
  operationName: string;
}
export const getHouseholdForMeRef: GetHouseholdForMeRef;

export function getHouseholdForMe(options?: ExecuteQueryOptions): QueryPromise<GetHouseholdForMeData, undefined>;
export function getHouseholdForMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetHouseholdForMeData, undefined>;

interface RegisterHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterHouseholdVariables): MutationRef<RegisterHouseholdData, RegisterHouseholdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterHouseholdVariables): MutationRef<RegisterHouseholdData, RegisterHouseholdVariables>;
  operationName: string;
}
export const registerHouseholdRef: RegisterHouseholdRef;

export function registerHousehold(vars: RegisterHouseholdVariables): MutationPromise<RegisterHouseholdData, RegisterHouseholdVariables>;
export function registerHousehold(dc: DataConnect, vars: RegisterHouseholdVariables): MutationPromise<RegisterHouseholdData, RegisterHouseholdVariables>;

interface AddHouseholdMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddHouseholdMemberVariables): MutationRef<AddHouseholdMemberData, AddHouseholdMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddHouseholdMemberVariables): MutationRef<AddHouseholdMemberData, AddHouseholdMemberVariables>;
  operationName: string;
}
export const addHouseholdMemberRef: AddHouseholdMemberRef;

export function addHouseholdMember(vars: AddHouseholdMemberVariables): MutationPromise<AddHouseholdMemberData, AddHouseholdMemberVariables>;
export function addHouseholdMember(dc: DataConnect, vars: AddHouseholdMemberVariables): MutationPromise<AddHouseholdMemberData, AddHouseholdMemberVariables>;

interface UpdateHouseholdMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHouseholdMemberVariables): MutationRef<UpdateHouseholdMemberData, UpdateHouseholdMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHouseholdMemberVariables): MutationRef<UpdateHouseholdMemberData, UpdateHouseholdMemberVariables>;
  operationName: string;
}
export const updateHouseholdMemberRef: UpdateHouseholdMemberRef;

export function updateHouseholdMember(vars: UpdateHouseholdMemberVariables): MutationPromise<UpdateHouseholdMemberData, UpdateHouseholdMemberVariables>;
export function updateHouseholdMember(dc: DataConnect, vars: UpdateHouseholdMemberVariables): MutationPromise<UpdateHouseholdMemberData, UpdateHouseholdMemberVariables>;

interface DeleteHouseholdMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHouseholdMemberVariables): MutationRef<DeleteHouseholdMemberData, DeleteHouseholdMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteHouseholdMemberVariables): MutationRef<DeleteHouseholdMemberData, DeleteHouseholdMemberVariables>;
  operationName: string;
}
export const deleteHouseholdMemberRef: DeleteHouseholdMemberRef;

export function deleteHouseholdMember(vars: DeleteHouseholdMemberVariables): MutationPromise<DeleteHouseholdMemberData, DeleteHouseholdMemberVariables>;
export function deleteHouseholdMember(dc: DataConnect, vars: DeleteHouseholdMemberVariables): MutationPromise<DeleteHouseholdMemberData, DeleteHouseholdMemberVariables>;

interface UpdateUserBudgetsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBudgetsVariables): MutationRef<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserBudgetsVariables): MutationRef<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;
  operationName: string;
}
export const updateUserBudgetsRef: UpdateUserBudgetsRef;

export function updateUserBudgets(vars: UpdateUserBudgetsVariables): MutationPromise<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;
export function updateUserBudgets(dc: DataConnect, vars: UpdateUserBudgetsVariables): MutationPromise<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;

interface InsertExpenseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertExpenseVariables): MutationRef<InsertExpenseData, InsertExpenseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertExpenseVariables): MutationRef<InsertExpenseData, InsertExpenseVariables>;
  operationName: string;
}
export const insertExpenseRef: InsertExpenseRef;

export function insertExpense(vars: InsertExpenseVariables): MutationPromise<InsertExpenseData, InsertExpenseVariables>;
export function insertExpense(dc: DataConnect, vars: InsertExpenseVariables): MutationPromise<InsertExpenseData, InsertExpenseVariables>;

interface UpdateExpenseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateExpenseVariables): MutationRef<UpdateExpenseData, UpdateExpenseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateExpenseVariables): MutationRef<UpdateExpenseData, UpdateExpenseVariables>;
  operationName: string;
}
export const updateExpenseRef: UpdateExpenseRef;

export function updateExpense(vars: UpdateExpenseVariables): MutationPromise<UpdateExpenseData, UpdateExpenseVariables>;
export function updateExpense(dc: DataConnect, vars: UpdateExpenseVariables): MutationPromise<UpdateExpenseData, UpdateExpenseVariables>;

interface DeleteExpenseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteExpenseVariables): MutationRef<DeleteExpenseData, DeleteExpenseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteExpenseVariables): MutationRef<DeleteExpenseData, DeleteExpenseVariables>;
  operationName: string;
}
export const deleteExpenseRef: DeleteExpenseRef;

export function deleteExpense(vars: DeleteExpenseVariables): MutationPromise<DeleteExpenseData, DeleteExpenseVariables>;
export function deleteExpense(dc: DataConnect, vars: DeleteExpenseVariables): MutationPromise<DeleteExpenseData, DeleteExpenseVariables>;

interface InsertIncomeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertIncomeVariables): MutationRef<InsertIncomeData, InsertIncomeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertIncomeVariables): MutationRef<InsertIncomeData, InsertIncomeVariables>;
  operationName: string;
}
export const insertIncomeRef: InsertIncomeRef;

export function insertIncome(vars: InsertIncomeVariables): MutationPromise<InsertIncomeData, InsertIncomeVariables>;
export function insertIncome(dc: DataConnect, vars: InsertIncomeVariables): MutationPromise<InsertIncomeData, InsertIncomeVariables>;

interface UpdateIncomeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncomeVariables): MutationRef<UpdateIncomeData, UpdateIncomeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateIncomeVariables): MutationRef<UpdateIncomeData, UpdateIncomeVariables>;
  operationName: string;
}
export const updateIncomeRef: UpdateIncomeRef;

export function updateIncome(vars: UpdateIncomeVariables): MutationPromise<UpdateIncomeData, UpdateIncomeVariables>;
export function updateIncome(dc: DataConnect, vars: UpdateIncomeVariables): MutationPromise<UpdateIncomeData, UpdateIncomeVariables>;

interface DeleteIncomeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIncomeVariables): MutationRef<DeleteIncomeData, DeleteIncomeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteIncomeVariables): MutationRef<DeleteIncomeData, DeleteIncomeVariables>;
  operationName: string;
}
export const deleteIncomeRef: DeleteIncomeRef;

export function deleteIncome(vars: DeleteIncomeVariables): MutationPromise<DeleteIncomeData, DeleteIncomeVariables>;
export function deleteIncome(dc: DataConnect, vars: DeleteIncomeVariables): MutationPromise<DeleteIncomeData, DeleteIncomeVariables>;

interface InsertCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCardVariables): MutationRef<InsertCardData, InsertCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertCardVariables): MutationRef<InsertCardData, InsertCardVariables>;
  operationName: string;
}
export const insertCardRef: InsertCardRef;

export function insertCard(vars: InsertCardVariables): MutationPromise<InsertCardData, InsertCardVariables>;
export function insertCard(dc: DataConnect, vars: InsertCardVariables): MutationPromise<InsertCardData, InsertCardVariables>;

interface UpdateCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCardVariables): MutationRef<UpdateCardData, UpdateCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCardVariables): MutationRef<UpdateCardData, UpdateCardVariables>;
  operationName: string;
}
export const updateCardRef: UpdateCardRef;

export function updateCard(vars: UpdateCardVariables): MutationPromise<UpdateCardData, UpdateCardVariables>;
export function updateCard(dc: DataConnect, vars: UpdateCardVariables): MutationPromise<UpdateCardData, UpdateCardVariables>;

interface DeleteCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCardVariables): MutationRef<DeleteCardData, DeleteCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCardVariables): MutationRef<DeleteCardData, DeleteCardVariables>;
  operationName: string;
}
export const deleteCardRef: DeleteCardRef;

export function deleteCard(vars: DeleteCardVariables): MutationPromise<DeleteCardData, DeleteCardVariables>;
export function deleteCard(dc: DataConnect, vars: DeleteCardVariables): MutationPromise<DeleteCardData, DeleteCardVariables>;

interface InsertGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertGoalVariables): MutationRef<InsertGoalData, InsertGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertGoalVariables): MutationRef<InsertGoalData, InsertGoalVariables>;
  operationName: string;
}
export const insertGoalRef: InsertGoalRef;

export function insertGoal(vars: InsertGoalVariables): MutationPromise<InsertGoalData, InsertGoalVariables>;
export function insertGoal(dc: DataConnect, vars: InsertGoalVariables): MutationPromise<InsertGoalData, InsertGoalVariables>;

interface UpdateGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalVariables): MutationRef<UpdateGoalData, UpdateGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGoalVariables): MutationRef<UpdateGoalData, UpdateGoalVariables>;
  operationName: string;
}
export const updateGoalRef: UpdateGoalRef;

export function updateGoal(vars: UpdateGoalVariables): MutationPromise<UpdateGoalData, UpdateGoalVariables>;
export function updateGoal(dc: DataConnect, vars: UpdateGoalVariables): MutationPromise<UpdateGoalData, UpdateGoalVariables>;

interface UpdateGoalSavedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalSavedVariables): MutationRef<UpdateGoalSavedData, UpdateGoalSavedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGoalSavedVariables): MutationRef<UpdateGoalSavedData, UpdateGoalSavedVariables>;
  operationName: string;
}
export const updateGoalSavedRef: UpdateGoalSavedRef;

export function updateGoalSaved(vars: UpdateGoalSavedVariables): MutationPromise<UpdateGoalSavedData, UpdateGoalSavedVariables>;
export function updateGoalSaved(dc: DataConnect, vars: UpdateGoalSavedVariables): MutationPromise<UpdateGoalSavedData, UpdateGoalSavedVariables>;

interface DeleteGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
  operationName: string;
}
export const deleteGoalRef: DeleteGoalRef;

export function deleteGoal(vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;
export function deleteGoal(dc: DataConnect, vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

interface InsertMonthHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertMonthHistoryVariables): MutationRef<InsertMonthHistoryData, InsertMonthHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertMonthHistoryVariables): MutationRef<InsertMonthHistoryData, InsertMonthHistoryVariables>;
  operationName: string;
}
export const insertMonthHistoryRef: InsertMonthHistoryRef;

export function insertMonthHistory(vars: InsertMonthHistoryVariables): MutationPromise<InsertMonthHistoryData, InsertMonthHistoryVariables>;
export function insertMonthHistory(dc: DataConnect, vars: InsertMonthHistoryVariables): MutationPromise<InsertMonthHistoryData, InsertMonthHistoryVariables>;

interface ResetUserExpensesPaidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserExpensesPaidVariables): MutationRef<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ResetUserExpensesPaidVariables): MutationRef<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;
  operationName: string;
}
export const resetUserExpensesPaidRef: ResetUserExpensesPaidRef;

export function resetUserExpensesPaid(vars: ResetUserExpensesPaidVariables): MutationPromise<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;
export function resetUserExpensesPaid(dc: DataConnect, vars: ResetUserExpensesPaidVariables): MutationPromise<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;

interface ResetUserIncomesReceivedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserIncomesReceivedVariables): MutationRef<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ResetUserIncomesReceivedVariables): MutationRef<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;
  operationName: string;
}
export const resetUserIncomesReceivedRef: ResetUserIncomesReceivedRef;

export function resetUserIncomesReceived(vars: ResetUserIncomesReceivedVariables): MutationPromise<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;
export function resetUserIncomesReceived(dc: DataConnect, vars: ResetUserIncomesReceivedVariables): MutationPromise<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;

interface ResetUserCardsPaidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserCardsPaidVariables): MutationRef<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ResetUserCardsPaidVariables): MutationRef<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;
  operationName: string;
}
export const resetUserCardsPaidRef: ResetUserCardsPaidRef;

export function resetUserCardsPaid(vars: ResetUserCardsPaidVariables): MutationPromise<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;
export function resetUserCardsPaid(dc: DataConnect, vars: ResetUserCardsPaidVariables): MutationPromise<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;

