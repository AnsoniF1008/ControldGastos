# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetHouseholdForMe*](#gethouseholdforme)
- [**Mutations**](#mutations)
  - [*RegisterHousehold*](#registerhousehold)
  - [*AddHouseholdMember*](#addhouseholdmember)
  - [*UpdateUserBudgets*](#updateuserbudgets)
  - [*InsertExpense*](#insertexpense)
  - [*UpdateExpense*](#updateexpense)
  - [*DeleteExpense*](#deleteexpense)
  - [*InsertIncome*](#insertincome)
  - [*UpdateIncome*](#updateincome)
  - [*DeleteIncome*](#deleteincome)
  - [*InsertCard*](#insertcard)
  - [*UpdateCard*](#updatecard)
  - [*DeleteCard*](#deletecard)
  - [*InsertGoal*](#insertgoal)
  - [*UpdateGoal*](#updategoal)
  - [*UpdateGoalSaved*](#updategoalsaved)
  - [*DeleteGoal*](#deletegoal)
  - [*InsertMonthHistory*](#insertmonthhistory)
  - [*ResetUserExpensesPaid*](#resetuserexpensespaid)
  - [*ResetUserIncomesReceived*](#resetuserincomesreceived)
  - [*ResetUserCardsPaid*](#resetusercardspaid)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@hogar-finance/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@hogar-finance/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@hogar-finance/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetHouseholdForMe
You can execute the `GetHouseholdForMe` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getHouseholdForMe(options?: ExecuteQueryOptions): QueryPromise<GetHouseholdForMeData, undefined>;

interface GetHouseholdForMeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetHouseholdForMeData, undefined>;
}
export const getHouseholdForMeRef: GetHouseholdForMeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getHouseholdForMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetHouseholdForMeData, undefined>;

interface GetHouseholdForMeRef {
  ...
  (dc: DataConnect): QueryRef<GetHouseholdForMeData, undefined>;
}
export const getHouseholdForMeRef: GetHouseholdForMeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getHouseholdForMeRef:
```typescript
const name = getHouseholdForMeRef.operationName;
console.log(name);
```

### Variables
The `GetHouseholdForMe` query has no variables.
### Return Type
Recall that executing the `GetHouseholdForMe` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetHouseholdForMeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
      } & Expense_Key)[];
        incomes_on_user: ({
          id: UUIDString;
          name: string;
          amount: number;
          frequency: string;
          category: string;
          received: boolean;
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
          } & Card_Key)[];
            goals_on_user: ({
              id: UUIDString;
              name: string;
              target: number;
              saved: number;
              monthly: number;
              emoji: string;
              color: string;
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
```
### Using `GetHouseholdForMe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getHouseholdForMe } from '@hogar-finance/dataconnect';


// Call the `getHouseholdForMe()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getHouseholdForMe();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getHouseholdForMe(dataConnect);

console.log(data.households);

// Or, you can use the `Promise` API.
getHouseholdForMe().then((response) => {
  const data = response.data;
  console.log(data.households);
});
```

### Using `GetHouseholdForMe`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getHouseholdForMeRef } from '@hogar-finance/dataconnect';


// Call the `getHouseholdForMeRef()` function to get a reference to the query.
const ref = getHouseholdForMeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getHouseholdForMeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.households);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.households);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## RegisterHousehold
You can execute the `RegisterHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
registerHousehold(vars: RegisterHouseholdVariables): MutationPromise<RegisterHouseholdData, RegisterHouseholdVariables>;

interface RegisterHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterHouseholdVariables): MutationRef<RegisterHouseholdData, RegisterHouseholdVariables>;
}
export const registerHouseholdRef: RegisterHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerHousehold(dc: DataConnect, vars: RegisterHouseholdVariables): MutationPromise<RegisterHouseholdData, RegisterHouseholdVariables>;

interface RegisterHouseholdRef {
  ...
  (dc: DataConnect, vars: RegisterHouseholdVariables): MutationRef<RegisterHouseholdData, RegisterHouseholdVariables>;
}
export const registerHouseholdRef: RegisterHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerHouseholdRef:
```typescript
const name = registerHouseholdRef.operationName;
console.log(name);
```

### Variables
The `RegisterHousehold` mutation requires an argument of type `RegisterHouseholdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterHouseholdVariables {
  name: string;
  emoji: string;
  color: string;
}
```
### Return Type
Recall that executing the `RegisterHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterHouseholdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterHouseholdData {
  household_insert: Household_Key;
  user_insert: User_Key;
}
```
### Using `RegisterHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerHousehold, RegisterHouseholdVariables } from '@hogar-finance/dataconnect';

// The `RegisterHousehold` mutation requires an argument of type `RegisterHouseholdVariables`:
const registerHouseholdVars: RegisterHouseholdVariables = {
  name: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `registerHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerHousehold(registerHouseholdVars);
// Variables can be defined inline as well.
const { data } = await registerHousehold({ name: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerHousehold(dataConnect, registerHouseholdVars);

console.log(data.household_insert);
console.log(data.user_insert);

// Or, you can use the `Promise` API.
registerHousehold(registerHouseholdVars).then((response) => {
  const data = response.data;
  console.log(data.household_insert);
  console.log(data.user_insert);
});
```

### Using `RegisterHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerHouseholdRef, RegisterHouseholdVariables } from '@hogar-finance/dataconnect';

// The `RegisterHousehold` mutation requires an argument of type `RegisterHouseholdVariables`:
const registerHouseholdVars: RegisterHouseholdVariables = {
  name: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `registerHouseholdRef()` function to get a reference to the mutation.
const ref = registerHouseholdRef(registerHouseholdVars);
// Variables can be defined inline as well.
const ref = registerHouseholdRef({ name: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerHouseholdRef(dataConnect, registerHouseholdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.household_insert);
console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.household_insert);
  console.log(data.user_insert);
});
```

## AddHouseholdMember
You can execute the `AddHouseholdMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addHouseholdMember(vars: AddHouseholdMemberVariables): MutationPromise<AddHouseholdMemberData, AddHouseholdMemberVariables>;

interface AddHouseholdMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddHouseholdMemberVariables): MutationRef<AddHouseholdMemberData, AddHouseholdMemberVariables>;
}
export const addHouseholdMemberRef: AddHouseholdMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addHouseholdMember(dc: DataConnect, vars: AddHouseholdMemberVariables): MutationPromise<AddHouseholdMemberData, AddHouseholdMemberVariables>;

interface AddHouseholdMemberRef {
  ...
  (dc: DataConnect, vars: AddHouseholdMemberVariables): MutationRef<AddHouseholdMemberData, AddHouseholdMemberVariables>;
}
export const addHouseholdMemberRef: AddHouseholdMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addHouseholdMemberRef:
```typescript
const name = addHouseholdMemberRef.operationName;
console.log(name);
```

### Variables
The `AddHouseholdMember` mutation requires an argument of type `AddHouseholdMemberVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddHouseholdMemberVariables {
  householdId: UUIDString;
  name: string;
  emoji: string;
  color: string;
  role: string;
  sortOrder: number;
}
```
### Return Type
Recall that executing the `AddHouseholdMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddHouseholdMemberData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddHouseholdMemberData {
  user_insert: User_Key;
}
```
### Using `AddHouseholdMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addHouseholdMember, AddHouseholdMemberVariables } from '@hogar-finance/dataconnect';

// The `AddHouseholdMember` mutation requires an argument of type `AddHouseholdMemberVariables`:
const addHouseholdMemberVars: AddHouseholdMemberVariables = {
  householdId: ..., 
  name: ..., 
  emoji: ..., 
  color: ..., 
  role: ..., 
  sortOrder: ..., 
};

// Call the `addHouseholdMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addHouseholdMember(addHouseholdMemberVars);
// Variables can be defined inline as well.
const { data } = await addHouseholdMember({ householdId: ..., name: ..., emoji: ..., color: ..., role: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addHouseholdMember(dataConnect, addHouseholdMemberVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
addHouseholdMember(addHouseholdMemberVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `AddHouseholdMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addHouseholdMemberRef, AddHouseholdMemberVariables } from '@hogar-finance/dataconnect';

// The `AddHouseholdMember` mutation requires an argument of type `AddHouseholdMemberVariables`:
const addHouseholdMemberVars: AddHouseholdMemberVariables = {
  householdId: ..., 
  name: ..., 
  emoji: ..., 
  color: ..., 
  role: ..., 
  sortOrder: ..., 
};

// Call the `addHouseholdMemberRef()` function to get a reference to the mutation.
const ref = addHouseholdMemberRef(addHouseholdMemberVars);
// Variables can be defined inline as well.
const ref = addHouseholdMemberRef({ householdId: ..., name: ..., emoji: ..., color: ..., role: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addHouseholdMemberRef(dataConnect, addHouseholdMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserBudgets
You can execute the `UpdateUserBudgets` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateUserBudgets(vars: UpdateUserBudgetsVariables): MutationPromise<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;

interface UpdateUserBudgetsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBudgetsVariables): MutationRef<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;
}
export const updateUserBudgetsRef: UpdateUserBudgetsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserBudgets(dc: DataConnect, vars: UpdateUserBudgetsVariables): MutationPromise<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;

interface UpdateUserBudgetsRef {
  ...
  (dc: DataConnect, vars: UpdateUserBudgetsVariables): MutationRef<UpdateUserBudgetsData, UpdateUserBudgetsVariables>;
}
export const updateUserBudgetsRef: UpdateUserBudgetsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserBudgetsRef:
```typescript
const name = updateUserBudgetsRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserBudgets` mutation requires an argument of type `UpdateUserBudgetsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserBudgetsVariables {
  userId: UUIDString;
  householdId: UUIDString;
  budgets: string;
}
```
### Return Type
Recall that executing the `UpdateUserBudgets` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserBudgetsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserBudgetsData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserBudgets`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserBudgets, UpdateUserBudgetsVariables } from '@hogar-finance/dataconnect';

// The `UpdateUserBudgets` mutation requires an argument of type `UpdateUserBudgetsVariables`:
const updateUserBudgetsVars: UpdateUserBudgetsVariables = {
  userId: ..., 
  householdId: ..., 
  budgets: ..., 
};

// Call the `updateUserBudgets()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserBudgets(updateUserBudgetsVars);
// Variables can be defined inline as well.
const { data } = await updateUserBudgets({ userId: ..., householdId: ..., budgets: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserBudgets(dataConnect, updateUserBudgetsVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserBudgets(updateUserBudgetsVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserBudgets`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserBudgetsRef, UpdateUserBudgetsVariables } from '@hogar-finance/dataconnect';

// The `UpdateUserBudgets` mutation requires an argument of type `UpdateUserBudgetsVariables`:
const updateUserBudgetsVars: UpdateUserBudgetsVariables = {
  userId: ..., 
  householdId: ..., 
  budgets: ..., 
};

// Call the `updateUserBudgetsRef()` function to get a reference to the mutation.
const ref = updateUserBudgetsRef(updateUserBudgetsVars);
// Variables can be defined inline as well.
const ref = updateUserBudgetsRef({ userId: ..., householdId: ..., budgets: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserBudgetsRef(dataConnect, updateUserBudgetsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## InsertExpense
You can execute the `InsertExpense` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertExpense(vars: InsertExpenseVariables): MutationPromise<InsertExpenseData, InsertExpenseVariables>;

interface InsertExpenseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertExpenseVariables): MutationRef<InsertExpenseData, InsertExpenseVariables>;
}
export const insertExpenseRef: InsertExpenseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertExpense(dc: DataConnect, vars: InsertExpenseVariables): MutationPromise<InsertExpenseData, InsertExpenseVariables>;

interface InsertExpenseRef {
  ...
  (dc: DataConnect, vars: InsertExpenseVariables): MutationRef<InsertExpenseData, InsertExpenseVariables>;
}
export const insertExpenseRef: InsertExpenseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertExpenseRef:
```typescript
const name = insertExpenseRef.operationName;
console.log(name);
```

### Variables
The `InsertExpense` mutation requires an argument of type `InsertExpenseVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertExpenseVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  paid: boolean;
  dueDay?: number | null;
}
```
### Return Type
Recall that executing the `InsertExpense` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertExpenseData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertExpenseData {
  expense_insert: Expense_Key;
}
```
### Using `InsertExpense`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertExpense, InsertExpenseVariables } from '@hogar-finance/dataconnect';

// The `InsertExpense` mutation requires an argument of type `InsertExpenseVariables`:
const insertExpenseVars: InsertExpenseVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  paid: ..., 
  dueDay: ..., // optional
};

// Call the `insertExpense()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertExpense(insertExpenseVars);
// Variables can be defined inline as well.
const { data } = await insertExpense({ householdId: ..., userId: ..., name: ..., amount: ..., frequency: ..., category: ..., paid: ..., dueDay: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertExpense(dataConnect, insertExpenseVars);

console.log(data.expense_insert);

// Or, you can use the `Promise` API.
insertExpense(insertExpenseVars).then((response) => {
  const data = response.data;
  console.log(data.expense_insert);
});
```

### Using `InsertExpense`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertExpenseRef, InsertExpenseVariables } from '@hogar-finance/dataconnect';

// The `InsertExpense` mutation requires an argument of type `InsertExpenseVariables`:
const insertExpenseVars: InsertExpenseVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  paid: ..., 
  dueDay: ..., // optional
};

// Call the `insertExpenseRef()` function to get a reference to the mutation.
const ref = insertExpenseRef(insertExpenseVars);
// Variables can be defined inline as well.
const ref = insertExpenseRef({ householdId: ..., userId: ..., name: ..., amount: ..., frequency: ..., category: ..., paid: ..., dueDay: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertExpenseRef(dataConnect, insertExpenseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expense_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expense_insert);
});
```

## UpdateExpense
You can execute the `UpdateExpense` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateExpense(vars: UpdateExpenseVariables): MutationPromise<UpdateExpenseData, UpdateExpenseVariables>;

interface UpdateExpenseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateExpenseVariables): MutationRef<UpdateExpenseData, UpdateExpenseVariables>;
}
export const updateExpenseRef: UpdateExpenseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateExpense(dc: DataConnect, vars: UpdateExpenseVariables): MutationPromise<UpdateExpenseData, UpdateExpenseVariables>;

interface UpdateExpenseRef {
  ...
  (dc: DataConnect, vars: UpdateExpenseVariables): MutationRef<UpdateExpenseData, UpdateExpenseVariables>;
}
export const updateExpenseRef: UpdateExpenseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateExpenseRef:
```typescript
const name = updateExpenseRef.operationName;
console.log(name);
```

### Variables
The `UpdateExpense` mutation requires an argument of type `UpdateExpenseVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateExpenseVariables {
  householdId: UUIDString;
  expenseId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  paid: boolean;
  dueDay?: number | null;
}
```
### Return Type
Recall that executing the `UpdateExpense` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateExpenseData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateExpenseData {
  expense_update?: Expense_Key | null;
}
```
### Using `UpdateExpense`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateExpense, UpdateExpenseVariables } from '@hogar-finance/dataconnect';

// The `UpdateExpense` mutation requires an argument of type `UpdateExpenseVariables`:
const updateExpenseVars: UpdateExpenseVariables = {
  householdId: ..., 
  expenseId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  paid: ..., 
  dueDay: ..., // optional
};

// Call the `updateExpense()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateExpense(updateExpenseVars);
// Variables can be defined inline as well.
const { data } = await updateExpense({ householdId: ..., expenseId: ..., name: ..., amount: ..., frequency: ..., category: ..., paid: ..., dueDay: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateExpense(dataConnect, updateExpenseVars);

console.log(data.expense_update);

// Or, you can use the `Promise` API.
updateExpense(updateExpenseVars).then((response) => {
  const data = response.data;
  console.log(data.expense_update);
});
```

### Using `UpdateExpense`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateExpenseRef, UpdateExpenseVariables } from '@hogar-finance/dataconnect';

// The `UpdateExpense` mutation requires an argument of type `UpdateExpenseVariables`:
const updateExpenseVars: UpdateExpenseVariables = {
  householdId: ..., 
  expenseId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  paid: ..., 
  dueDay: ..., // optional
};

// Call the `updateExpenseRef()` function to get a reference to the mutation.
const ref = updateExpenseRef(updateExpenseVars);
// Variables can be defined inline as well.
const ref = updateExpenseRef({ householdId: ..., expenseId: ..., name: ..., amount: ..., frequency: ..., category: ..., paid: ..., dueDay: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateExpenseRef(dataConnect, updateExpenseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expense_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expense_update);
});
```

## DeleteExpense
You can execute the `DeleteExpense` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteExpense(vars: DeleteExpenseVariables): MutationPromise<DeleteExpenseData, DeleteExpenseVariables>;

interface DeleteExpenseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteExpenseVariables): MutationRef<DeleteExpenseData, DeleteExpenseVariables>;
}
export const deleteExpenseRef: DeleteExpenseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteExpense(dc: DataConnect, vars: DeleteExpenseVariables): MutationPromise<DeleteExpenseData, DeleteExpenseVariables>;

interface DeleteExpenseRef {
  ...
  (dc: DataConnect, vars: DeleteExpenseVariables): MutationRef<DeleteExpenseData, DeleteExpenseVariables>;
}
export const deleteExpenseRef: DeleteExpenseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteExpenseRef:
```typescript
const name = deleteExpenseRef.operationName;
console.log(name);
```

### Variables
The `DeleteExpense` mutation requires an argument of type `DeleteExpenseVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteExpenseVariables {
  householdId: UUIDString;
  expenseId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteExpense` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteExpenseData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteExpenseData {
  expense_delete?: Expense_Key | null;
}
```
### Using `DeleteExpense`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteExpense, DeleteExpenseVariables } from '@hogar-finance/dataconnect';

// The `DeleteExpense` mutation requires an argument of type `DeleteExpenseVariables`:
const deleteExpenseVars: DeleteExpenseVariables = {
  householdId: ..., 
  expenseId: ..., 
};

// Call the `deleteExpense()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteExpense(deleteExpenseVars);
// Variables can be defined inline as well.
const { data } = await deleteExpense({ householdId: ..., expenseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteExpense(dataConnect, deleteExpenseVars);

console.log(data.expense_delete);

// Or, you can use the `Promise` API.
deleteExpense(deleteExpenseVars).then((response) => {
  const data = response.data;
  console.log(data.expense_delete);
});
```

### Using `DeleteExpense`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteExpenseRef, DeleteExpenseVariables } from '@hogar-finance/dataconnect';

// The `DeleteExpense` mutation requires an argument of type `DeleteExpenseVariables`:
const deleteExpenseVars: DeleteExpenseVariables = {
  householdId: ..., 
  expenseId: ..., 
};

// Call the `deleteExpenseRef()` function to get a reference to the mutation.
const ref = deleteExpenseRef(deleteExpenseVars);
// Variables can be defined inline as well.
const ref = deleteExpenseRef({ householdId: ..., expenseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteExpenseRef(dataConnect, deleteExpenseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expense_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expense_delete);
});
```

## InsertIncome
You can execute the `InsertIncome` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertIncome(vars: InsertIncomeVariables): MutationPromise<InsertIncomeData, InsertIncomeVariables>;

interface InsertIncomeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertIncomeVariables): MutationRef<InsertIncomeData, InsertIncomeVariables>;
}
export const insertIncomeRef: InsertIncomeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertIncome(dc: DataConnect, vars: InsertIncomeVariables): MutationPromise<InsertIncomeData, InsertIncomeVariables>;

interface InsertIncomeRef {
  ...
  (dc: DataConnect, vars: InsertIncomeVariables): MutationRef<InsertIncomeData, InsertIncomeVariables>;
}
export const insertIncomeRef: InsertIncomeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertIncomeRef:
```typescript
const name = insertIncomeRef.operationName;
console.log(name);
```

### Variables
The `InsertIncome` mutation requires an argument of type `InsertIncomeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertIncomeVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  received: boolean;
}
```
### Return Type
Recall that executing the `InsertIncome` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertIncomeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertIncomeData {
  income_insert: Income_Key;
}
```
### Using `InsertIncome`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertIncome, InsertIncomeVariables } from '@hogar-finance/dataconnect';

// The `InsertIncome` mutation requires an argument of type `InsertIncomeVariables`:
const insertIncomeVars: InsertIncomeVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  received: ..., 
};

// Call the `insertIncome()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertIncome(insertIncomeVars);
// Variables can be defined inline as well.
const { data } = await insertIncome({ householdId: ..., userId: ..., name: ..., amount: ..., frequency: ..., category: ..., received: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertIncome(dataConnect, insertIncomeVars);

console.log(data.income_insert);

// Or, you can use the `Promise` API.
insertIncome(insertIncomeVars).then((response) => {
  const data = response.data;
  console.log(data.income_insert);
});
```

### Using `InsertIncome`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertIncomeRef, InsertIncomeVariables } from '@hogar-finance/dataconnect';

// The `InsertIncome` mutation requires an argument of type `InsertIncomeVariables`:
const insertIncomeVars: InsertIncomeVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  received: ..., 
};

// Call the `insertIncomeRef()` function to get a reference to the mutation.
const ref = insertIncomeRef(insertIncomeVars);
// Variables can be defined inline as well.
const ref = insertIncomeRef({ householdId: ..., userId: ..., name: ..., amount: ..., frequency: ..., category: ..., received: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertIncomeRef(dataConnect, insertIncomeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.income_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.income_insert);
});
```

## UpdateIncome
You can execute the `UpdateIncome` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateIncome(vars: UpdateIncomeVariables): MutationPromise<UpdateIncomeData, UpdateIncomeVariables>;

interface UpdateIncomeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncomeVariables): MutationRef<UpdateIncomeData, UpdateIncomeVariables>;
}
export const updateIncomeRef: UpdateIncomeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateIncome(dc: DataConnect, vars: UpdateIncomeVariables): MutationPromise<UpdateIncomeData, UpdateIncomeVariables>;

interface UpdateIncomeRef {
  ...
  (dc: DataConnect, vars: UpdateIncomeVariables): MutationRef<UpdateIncomeData, UpdateIncomeVariables>;
}
export const updateIncomeRef: UpdateIncomeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateIncomeRef:
```typescript
const name = updateIncomeRef.operationName;
console.log(name);
```

### Variables
The `UpdateIncome` mutation requires an argument of type `UpdateIncomeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateIncomeVariables {
  householdId: UUIDString;
  incomeId: UUIDString;
  name: string;
  amount: number;
  frequency: string;
  category: string;
  received: boolean;
}
```
### Return Type
Recall that executing the `UpdateIncome` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateIncomeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateIncomeData {
  income_update?: Income_Key | null;
}
```
### Using `UpdateIncome`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateIncome, UpdateIncomeVariables } from '@hogar-finance/dataconnect';

// The `UpdateIncome` mutation requires an argument of type `UpdateIncomeVariables`:
const updateIncomeVars: UpdateIncomeVariables = {
  householdId: ..., 
  incomeId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  received: ..., 
};

// Call the `updateIncome()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateIncome(updateIncomeVars);
// Variables can be defined inline as well.
const { data } = await updateIncome({ householdId: ..., incomeId: ..., name: ..., amount: ..., frequency: ..., category: ..., received: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateIncome(dataConnect, updateIncomeVars);

console.log(data.income_update);

// Or, you can use the `Promise` API.
updateIncome(updateIncomeVars).then((response) => {
  const data = response.data;
  console.log(data.income_update);
});
```

### Using `UpdateIncome`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateIncomeRef, UpdateIncomeVariables } from '@hogar-finance/dataconnect';

// The `UpdateIncome` mutation requires an argument of type `UpdateIncomeVariables`:
const updateIncomeVars: UpdateIncomeVariables = {
  householdId: ..., 
  incomeId: ..., 
  name: ..., 
  amount: ..., 
  frequency: ..., 
  category: ..., 
  received: ..., 
};

// Call the `updateIncomeRef()` function to get a reference to the mutation.
const ref = updateIncomeRef(updateIncomeVars);
// Variables can be defined inline as well.
const ref = updateIncomeRef({ householdId: ..., incomeId: ..., name: ..., amount: ..., frequency: ..., category: ..., received: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateIncomeRef(dataConnect, updateIncomeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.income_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.income_update);
});
```

## DeleteIncome
You can execute the `DeleteIncome` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteIncome(vars: DeleteIncomeVariables): MutationPromise<DeleteIncomeData, DeleteIncomeVariables>;

interface DeleteIncomeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIncomeVariables): MutationRef<DeleteIncomeData, DeleteIncomeVariables>;
}
export const deleteIncomeRef: DeleteIncomeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIncome(dc: DataConnect, vars: DeleteIncomeVariables): MutationPromise<DeleteIncomeData, DeleteIncomeVariables>;

interface DeleteIncomeRef {
  ...
  (dc: DataConnect, vars: DeleteIncomeVariables): MutationRef<DeleteIncomeData, DeleteIncomeVariables>;
}
export const deleteIncomeRef: DeleteIncomeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIncomeRef:
```typescript
const name = deleteIncomeRef.operationName;
console.log(name);
```

### Variables
The `DeleteIncome` mutation requires an argument of type `DeleteIncomeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIncomeVariables {
  householdId: UUIDString;
  incomeId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteIncome` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIncomeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIncomeData {
  income_delete?: Income_Key | null;
}
```
### Using `DeleteIncome`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIncome, DeleteIncomeVariables } from '@hogar-finance/dataconnect';

// The `DeleteIncome` mutation requires an argument of type `DeleteIncomeVariables`:
const deleteIncomeVars: DeleteIncomeVariables = {
  householdId: ..., 
  incomeId: ..., 
};

// Call the `deleteIncome()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIncome(deleteIncomeVars);
// Variables can be defined inline as well.
const { data } = await deleteIncome({ householdId: ..., incomeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIncome(dataConnect, deleteIncomeVars);

console.log(data.income_delete);

// Or, you can use the `Promise` API.
deleteIncome(deleteIncomeVars).then((response) => {
  const data = response.data;
  console.log(data.income_delete);
});
```

### Using `DeleteIncome`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIncomeRef, DeleteIncomeVariables } from '@hogar-finance/dataconnect';

// The `DeleteIncome` mutation requires an argument of type `DeleteIncomeVariables`:
const deleteIncomeVars: DeleteIncomeVariables = {
  householdId: ..., 
  incomeId: ..., 
};

// Call the `deleteIncomeRef()` function to get a reference to the mutation.
const ref = deleteIncomeRef(deleteIncomeVars);
// Variables can be defined inline as well.
const ref = deleteIncomeRef({ householdId: ..., incomeId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIncomeRef(dataConnect, deleteIncomeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.income_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.income_delete);
});
```

## InsertCard
You can execute the `InsertCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertCard(vars: InsertCardVariables): MutationPromise<InsertCardData, InsertCardVariables>;

interface InsertCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCardVariables): MutationRef<InsertCardData, InsertCardVariables>;
}
export const insertCardRef: InsertCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertCard(dc: DataConnect, vars: InsertCardVariables): MutationPromise<InsertCardData, InsertCardVariables>;

interface InsertCardRef {
  ...
  (dc: DataConnect, vars: InsertCardVariables): MutationRef<InsertCardData, InsertCardVariables>;
}
export const insertCardRef: InsertCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertCardRef:
```typescript
const name = insertCardRef.operationName;
console.log(name);
```

### Variables
The `InsertCard` mutation requires an argument of type `InsertCardVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
}
```
### Return Type
Recall that executing the `InsertCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertCardData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertCardData {
  card_insert: Card_Key;
}
```
### Using `InsertCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertCard, InsertCardVariables } from '@hogar-finance/dataconnect';

// The `InsertCard` mutation requires an argument of type `InsertCardVariables`:
const insertCardVars: InsertCardVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  brand: ..., 
  creditLimit: ..., 
  balance: ..., 
  minPayment: ..., 
  dueDay: ..., 
  paid: ..., 
};

// Call the `insertCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertCard(insertCardVars);
// Variables can be defined inline as well.
const { data } = await insertCard({ householdId: ..., userId: ..., name: ..., brand: ..., creditLimit: ..., balance: ..., minPayment: ..., dueDay: ..., paid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertCard(dataConnect, insertCardVars);

console.log(data.card_insert);

// Or, you can use the `Promise` API.
insertCard(insertCardVars).then((response) => {
  const data = response.data;
  console.log(data.card_insert);
});
```

### Using `InsertCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertCardRef, InsertCardVariables } from '@hogar-finance/dataconnect';

// The `InsertCard` mutation requires an argument of type `InsertCardVariables`:
const insertCardVars: InsertCardVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  brand: ..., 
  creditLimit: ..., 
  balance: ..., 
  minPayment: ..., 
  dueDay: ..., 
  paid: ..., 
};

// Call the `insertCardRef()` function to get a reference to the mutation.
const ref = insertCardRef(insertCardVars);
// Variables can be defined inline as well.
const ref = insertCardRef({ householdId: ..., userId: ..., name: ..., brand: ..., creditLimit: ..., balance: ..., minPayment: ..., dueDay: ..., paid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertCardRef(dataConnect, insertCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.card_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.card_insert);
});
```

## UpdateCard
You can execute the `UpdateCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateCard(vars: UpdateCardVariables): MutationPromise<UpdateCardData, UpdateCardVariables>;

interface UpdateCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCardVariables): MutationRef<UpdateCardData, UpdateCardVariables>;
}
export const updateCardRef: UpdateCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCard(dc: DataConnect, vars: UpdateCardVariables): MutationPromise<UpdateCardData, UpdateCardVariables>;

interface UpdateCardRef {
  ...
  (dc: DataConnect, vars: UpdateCardVariables): MutationRef<UpdateCardData, UpdateCardVariables>;
}
export const updateCardRef: UpdateCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCardRef:
```typescript
const name = updateCardRef.operationName;
console.log(name);
```

### Variables
The `UpdateCard` mutation requires an argument of type `UpdateCardVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
}
```
### Return Type
Recall that executing the `UpdateCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCardData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCardData {
  card_update?: Card_Key | null;
}
```
### Using `UpdateCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCard, UpdateCardVariables } from '@hogar-finance/dataconnect';

// The `UpdateCard` mutation requires an argument of type `UpdateCardVariables`:
const updateCardVars: UpdateCardVariables = {
  householdId: ..., 
  cardId: ..., 
  name: ..., 
  brand: ..., 
  creditLimit: ..., 
  balance: ..., 
  minPayment: ..., 
  dueDay: ..., 
  paid: ..., 
};

// Call the `updateCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCard(updateCardVars);
// Variables can be defined inline as well.
const { data } = await updateCard({ householdId: ..., cardId: ..., name: ..., brand: ..., creditLimit: ..., balance: ..., minPayment: ..., dueDay: ..., paid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCard(dataConnect, updateCardVars);

console.log(data.card_update);

// Or, you can use the `Promise` API.
updateCard(updateCardVars).then((response) => {
  const data = response.data;
  console.log(data.card_update);
});
```

### Using `UpdateCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCardRef, UpdateCardVariables } from '@hogar-finance/dataconnect';

// The `UpdateCard` mutation requires an argument of type `UpdateCardVariables`:
const updateCardVars: UpdateCardVariables = {
  householdId: ..., 
  cardId: ..., 
  name: ..., 
  brand: ..., 
  creditLimit: ..., 
  balance: ..., 
  minPayment: ..., 
  dueDay: ..., 
  paid: ..., 
};

// Call the `updateCardRef()` function to get a reference to the mutation.
const ref = updateCardRef(updateCardVars);
// Variables can be defined inline as well.
const ref = updateCardRef({ householdId: ..., cardId: ..., name: ..., brand: ..., creditLimit: ..., balance: ..., minPayment: ..., dueDay: ..., paid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCardRef(dataConnect, updateCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.card_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.card_update);
});
```

## DeleteCard
You can execute the `DeleteCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteCard(vars: DeleteCardVariables): MutationPromise<DeleteCardData, DeleteCardVariables>;

interface DeleteCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCardVariables): MutationRef<DeleteCardData, DeleteCardVariables>;
}
export const deleteCardRef: DeleteCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCard(dc: DataConnect, vars: DeleteCardVariables): MutationPromise<DeleteCardData, DeleteCardVariables>;

interface DeleteCardRef {
  ...
  (dc: DataConnect, vars: DeleteCardVariables): MutationRef<DeleteCardData, DeleteCardVariables>;
}
export const deleteCardRef: DeleteCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCardRef:
```typescript
const name = deleteCardRef.operationName;
console.log(name);
```

### Variables
The `DeleteCard` mutation requires an argument of type `DeleteCardVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCardVariables {
  householdId: UUIDString;
  cardId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCardData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCardData {
  card_delete?: Card_Key | null;
}
```
### Using `DeleteCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCard, DeleteCardVariables } from '@hogar-finance/dataconnect';

// The `DeleteCard` mutation requires an argument of type `DeleteCardVariables`:
const deleteCardVars: DeleteCardVariables = {
  householdId: ..., 
  cardId: ..., 
};

// Call the `deleteCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCard(deleteCardVars);
// Variables can be defined inline as well.
const { data } = await deleteCard({ householdId: ..., cardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCard(dataConnect, deleteCardVars);

console.log(data.card_delete);

// Or, you can use the `Promise` API.
deleteCard(deleteCardVars).then((response) => {
  const data = response.data;
  console.log(data.card_delete);
});
```

### Using `DeleteCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCardRef, DeleteCardVariables } from '@hogar-finance/dataconnect';

// The `DeleteCard` mutation requires an argument of type `DeleteCardVariables`:
const deleteCardVars: DeleteCardVariables = {
  householdId: ..., 
  cardId: ..., 
};

// Call the `deleteCardRef()` function to get a reference to the mutation.
const ref = deleteCardRef(deleteCardVars);
// Variables can be defined inline as well.
const ref = deleteCardRef({ householdId: ..., cardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCardRef(dataConnect, deleteCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.card_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.card_delete);
});
```

## InsertGoal
You can execute the `InsertGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertGoal(vars: InsertGoalVariables): MutationPromise<InsertGoalData, InsertGoalVariables>;

interface InsertGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertGoalVariables): MutationRef<InsertGoalData, InsertGoalVariables>;
}
export const insertGoalRef: InsertGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertGoal(dc: DataConnect, vars: InsertGoalVariables): MutationPromise<InsertGoalData, InsertGoalVariables>;

interface InsertGoalRef {
  ...
  (dc: DataConnect, vars: InsertGoalVariables): MutationRef<InsertGoalData, InsertGoalVariables>;
}
export const insertGoalRef: InsertGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertGoalRef:
```typescript
const name = insertGoalRef.operationName;
console.log(name);
```

### Variables
The `InsertGoal` mutation requires an argument of type `InsertGoalVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertGoalVariables {
  householdId: UUIDString;
  userId: UUIDString;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  emoji: string;
  color: string;
}
```
### Return Type
Recall that executing the `InsertGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertGoalData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertGoalData {
  goal_insert: Goal_Key;
}
```
### Using `InsertGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertGoal, InsertGoalVariables } from '@hogar-finance/dataconnect';

// The `InsertGoal` mutation requires an argument of type `InsertGoalVariables`:
const insertGoalVars: InsertGoalVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  target: ..., 
  saved: ..., 
  monthly: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `insertGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertGoal(insertGoalVars);
// Variables can be defined inline as well.
const { data } = await insertGoal({ householdId: ..., userId: ..., name: ..., target: ..., saved: ..., monthly: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertGoal(dataConnect, insertGoalVars);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
insertGoal(insertGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

### Using `InsertGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertGoalRef, InsertGoalVariables } from '@hogar-finance/dataconnect';

// The `InsertGoal` mutation requires an argument of type `InsertGoalVariables`:
const insertGoalVars: InsertGoalVariables = {
  householdId: ..., 
  userId: ..., 
  name: ..., 
  target: ..., 
  saved: ..., 
  monthly: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `insertGoalRef()` function to get a reference to the mutation.
const ref = insertGoalRef(insertGoalVars);
// Variables can be defined inline as well.
const ref = insertGoalRef({ householdId: ..., userId: ..., name: ..., target: ..., saved: ..., monthly: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertGoalRef(dataConnect, insertGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

## UpdateGoal
You can execute the `UpdateGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateGoal(vars: UpdateGoalVariables): MutationPromise<UpdateGoalData, UpdateGoalVariables>;

interface UpdateGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalVariables): MutationRef<UpdateGoalData, UpdateGoalVariables>;
}
export const updateGoalRef: UpdateGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGoal(dc: DataConnect, vars: UpdateGoalVariables): MutationPromise<UpdateGoalData, UpdateGoalVariables>;

interface UpdateGoalRef {
  ...
  (dc: DataConnect, vars: UpdateGoalVariables): MutationRef<UpdateGoalData, UpdateGoalVariables>;
}
export const updateGoalRef: UpdateGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGoalRef:
```typescript
const name = updateGoalRef.operationName;
console.log(name);
```

### Variables
The `UpdateGoal` mutation requires an argument of type `UpdateGoalVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGoalVariables {
  householdId: UUIDString;
  goalId: UUIDString;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  emoji: string;
  color: string;
}
```
### Return Type
Recall that executing the `UpdateGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGoalData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGoalData {
  goal_update?: Goal_Key | null;
}
```
### Using `UpdateGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGoal, UpdateGoalVariables } from '@hogar-finance/dataconnect';

// The `UpdateGoal` mutation requires an argument of type `UpdateGoalVariables`:
const updateGoalVars: UpdateGoalVariables = {
  householdId: ..., 
  goalId: ..., 
  name: ..., 
  target: ..., 
  saved: ..., 
  monthly: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `updateGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGoal(updateGoalVars);
// Variables can be defined inline as well.
const { data } = await updateGoal({ householdId: ..., goalId: ..., name: ..., target: ..., saved: ..., monthly: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGoal(dataConnect, updateGoalVars);

console.log(data.goal_update);

// Or, you can use the `Promise` API.
updateGoal(updateGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_update);
});
```

### Using `UpdateGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGoalRef, UpdateGoalVariables } from '@hogar-finance/dataconnect';

// The `UpdateGoal` mutation requires an argument of type `UpdateGoalVariables`:
const updateGoalVars: UpdateGoalVariables = {
  householdId: ..., 
  goalId: ..., 
  name: ..., 
  target: ..., 
  saved: ..., 
  monthly: ..., 
  emoji: ..., 
  color: ..., 
};

// Call the `updateGoalRef()` function to get a reference to the mutation.
const ref = updateGoalRef(updateGoalVars);
// Variables can be defined inline as well.
const ref = updateGoalRef({ householdId: ..., goalId: ..., name: ..., target: ..., saved: ..., monthly: ..., emoji: ..., color: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGoalRef(dataConnect, updateGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_update);
});
```

## UpdateGoalSaved
You can execute the `UpdateGoalSaved` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateGoalSaved(vars: UpdateGoalSavedVariables): MutationPromise<UpdateGoalSavedData, UpdateGoalSavedVariables>;

interface UpdateGoalSavedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalSavedVariables): MutationRef<UpdateGoalSavedData, UpdateGoalSavedVariables>;
}
export const updateGoalSavedRef: UpdateGoalSavedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGoalSaved(dc: DataConnect, vars: UpdateGoalSavedVariables): MutationPromise<UpdateGoalSavedData, UpdateGoalSavedVariables>;

interface UpdateGoalSavedRef {
  ...
  (dc: DataConnect, vars: UpdateGoalSavedVariables): MutationRef<UpdateGoalSavedData, UpdateGoalSavedVariables>;
}
export const updateGoalSavedRef: UpdateGoalSavedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGoalSavedRef:
```typescript
const name = updateGoalSavedRef.operationName;
console.log(name);
```

### Variables
The `UpdateGoalSaved` mutation requires an argument of type `UpdateGoalSavedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGoalSavedVariables {
  householdId: UUIDString;
  goalId: UUIDString;
  saved: number;
}
```
### Return Type
Recall that executing the `UpdateGoalSaved` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGoalSavedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGoalSavedData {
  goal_update?: Goal_Key | null;
}
```
### Using `UpdateGoalSaved`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGoalSaved, UpdateGoalSavedVariables } from '@hogar-finance/dataconnect';

// The `UpdateGoalSaved` mutation requires an argument of type `UpdateGoalSavedVariables`:
const updateGoalSavedVars: UpdateGoalSavedVariables = {
  householdId: ..., 
  goalId: ..., 
  saved: ..., 
};

// Call the `updateGoalSaved()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGoalSaved(updateGoalSavedVars);
// Variables can be defined inline as well.
const { data } = await updateGoalSaved({ householdId: ..., goalId: ..., saved: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGoalSaved(dataConnect, updateGoalSavedVars);

console.log(data.goal_update);

// Or, you can use the `Promise` API.
updateGoalSaved(updateGoalSavedVars).then((response) => {
  const data = response.data;
  console.log(data.goal_update);
});
```

### Using `UpdateGoalSaved`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGoalSavedRef, UpdateGoalSavedVariables } from '@hogar-finance/dataconnect';

// The `UpdateGoalSaved` mutation requires an argument of type `UpdateGoalSavedVariables`:
const updateGoalSavedVars: UpdateGoalSavedVariables = {
  householdId: ..., 
  goalId: ..., 
  saved: ..., 
};

// Call the `updateGoalSavedRef()` function to get a reference to the mutation.
const ref = updateGoalSavedRef(updateGoalSavedVars);
// Variables can be defined inline as well.
const ref = updateGoalSavedRef({ householdId: ..., goalId: ..., saved: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGoalSavedRef(dataConnect, updateGoalSavedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_update);
});
```

## DeleteGoal
You can execute the `DeleteGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteGoal(vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

interface DeleteGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
}
export const deleteGoalRef: DeleteGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGoal(dc: DataConnect, vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

interface DeleteGoalRef {
  ...
  (dc: DataConnect, vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
}
export const deleteGoalRef: DeleteGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGoalRef:
```typescript
const name = deleteGoalRef.operationName;
console.log(name);
```

### Variables
The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGoalVariables {
  householdId: UUIDString;
  goalId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGoalData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGoalData {
  goal_delete?: Goal_Key | null;
}
```
### Using `DeleteGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGoal, DeleteGoalVariables } from '@hogar-finance/dataconnect';

// The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`:
const deleteGoalVars: DeleteGoalVariables = {
  householdId: ..., 
  goalId: ..., 
};

// Call the `deleteGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGoal(deleteGoalVars);
// Variables can be defined inline as well.
const { data } = await deleteGoal({ householdId: ..., goalId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGoal(dataConnect, deleteGoalVars);

console.log(data.goal_delete);

// Or, you can use the `Promise` API.
deleteGoal(deleteGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_delete);
});
```

### Using `DeleteGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGoalRef, DeleteGoalVariables } from '@hogar-finance/dataconnect';

// The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`:
const deleteGoalVars: DeleteGoalVariables = {
  householdId: ..., 
  goalId: ..., 
};

// Call the `deleteGoalRef()` function to get a reference to the mutation.
const ref = deleteGoalRef(deleteGoalVars);
// Variables can be defined inline as well.
const ref = deleteGoalRef({ householdId: ..., goalId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGoalRef(dataConnect, deleteGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_delete);
});
```

## InsertMonthHistory
You can execute the `InsertMonthHistory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertMonthHistory(vars: InsertMonthHistoryVariables): MutationPromise<InsertMonthHistoryData, InsertMonthHistoryVariables>;

interface InsertMonthHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertMonthHistoryVariables): MutationRef<InsertMonthHistoryData, InsertMonthHistoryVariables>;
}
export const insertMonthHistoryRef: InsertMonthHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertMonthHistory(dc: DataConnect, vars: InsertMonthHistoryVariables): MutationPromise<InsertMonthHistoryData, InsertMonthHistoryVariables>;

interface InsertMonthHistoryRef {
  ...
  (dc: DataConnect, vars: InsertMonthHistoryVariables): MutationRef<InsertMonthHistoryData, InsertMonthHistoryVariables>;
}
export const insertMonthHistoryRef: InsertMonthHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertMonthHistoryRef:
```typescript
const name = insertMonthHistoryRef.operationName;
console.log(name);
```

### Variables
The `InsertMonthHistory` mutation requires an argument of type `InsertMonthHistoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `InsertMonthHistory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertMonthHistoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertMonthHistoryData {
  monthHistory_insert: MonthHistory_Key;
}
```
### Using `InsertMonthHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertMonthHistory, InsertMonthHistoryVariables } from '@hogar-finance/dataconnect';

// The `InsertMonthHistory` mutation requires an argument of type `InsertMonthHistoryVariables`:
const insertMonthHistoryVars: InsertMonthHistoryVariables = {
  householdId: ..., 
  userId: ..., 
  month: ..., 
  year: ..., 
  totalExp: ..., 
  paidExp: ..., 
  totalInc: ..., 
  recvInc: ..., 
  totalDebt: ..., 
};

// Call the `insertMonthHistory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertMonthHistory(insertMonthHistoryVars);
// Variables can be defined inline as well.
const { data } = await insertMonthHistory({ householdId: ..., userId: ..., month: ..., year: ..., totalExp: ..., paidExp: ..., totalInc: ..., recvInc: ..., totalDebt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertMonthHistory(dataConnect, insertMonthHistoryVars);

console.log(data.monthHistory_insert);

// Or, you can use the `Promise` API.
insertMonthHistory(insertMonthHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.monthHistory_insert);
});
```

### Using `InsertMonthHistory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertMonthHistoryRef, InsertMonthHistoryVariables } from '@hogar-finance/dataconnect';

// The `InsertMonthHistory` mutation requires an argument of type `InsertMonthHistoryVariables`:
const insertMonthHistoryVars: InsertMonthHistoryVariables = {
  householdId: ..., 
  userId: ..., 
  month: ..., 
  year: ..., 
  totalExp: ..., 
  paidExp: ..., 
  totalInc: ..., 
  recvInc: ..., 
  totalDebt: ..., 
};

// Call the `insertMonthHistoryRef()` function to get a reference to the mutation.
const ref = insertMonthHistoryRef(insertMonthHistoryVars);
// Variables can be defined inline as well.
const ref = insertMonthHistoryRef({ householdId: ..., userId: ..., month: ..., year: ..., totalExp: ..., paidExp: ..., totalInc: ..., recvInc: ..., totalDebt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertMonthHistoryRef(dataConnect, insertMonthHistoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.monthHistory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.monthHistory_insert);
});
```

## ResetUserExpensesPaid
You can execute the `ResetUserExpensesPaid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
resetUserExpensesPaid(vars: ResetUserExpensesPaidVariables): MutationPromise<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;

interface ResetUserExpensesPaidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserExpensesPaidVariables): MutationRef<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;
}
export const resetUserExpensesPaidRef: ResetUserExpensesPaidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resetUserExpensesPaid(dc: DataConnect, vars: ResetUserExpensesPaidVariables): MutationPromise<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;

interface ResetUserExpensesPaidRef {
  ...
  (dc: DataConnect, vars: ResetUserExpensesPaidVariables): MutationRef<ResetUserExpensesPaidData, ResetUserExpensesPaidVariables>;
}
export const resetUserExpensesPaidRef: ResetUserExpensesPaidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resetUserExpensesPaidRef:
```typescript
const name = resetUserExpensesPaidRef.operationName;
console.log(name);
```

### Variables
The `ResetUserExpensesPaid` mutation requires an argument of type `ResetUserExpensesPaidVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ResetUserExpensesPaidVariables {
  householdId: UUIDString;
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ResetUserExpensesPaid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResetUserExpensesPaidData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResetUserExpensesPaidData {
  expense_updateMany: number;
}
```
### Using `ResetUserExpensesPaid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resetUserExpensesPaid, ResetUserExpensesPaidVariables } from '@hogar-finance/dataconnect';

// The `ResetUserExpensesPaid` mutation requires an argument of type `ResetUserExpensesPaidVariables`:
const resetUserExpensesPaidVars: ResetUserExpensesPaidVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserExpensesPaid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resetUserExpensesPaid(resetUserExpensesPaidVars);
// Variables can be defined inline as well.
const { data } = await resetUserExpensesPaid({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resetUserExpensesPaid(dataConnect, resetUserExpensesPaidVars);

console.log(data.expense_updateMany);

// Or, you can use the `Promise` API.
resetUserExpensesPaid(resetUserExpensesPaidVars).then((response) => {
  const data = response.data;
  console.log(data.expense_updateMany);
});
```

### Using `ResetUserExpensesPaid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resetUserExpensesPaidRef, ResetUserExpensesPaidVariables } from '@hogar-finance/dataconnect';

// The `ResetUserExpensesPaid` mutation requires an argument of type `ResetUserExpensesPaidVariables`:
const resetUserExpensesPaidVars: ResetUserExpensesPaidVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserExpensesPaidRef()` function to get a reference to the mutation.
const ref = resetUserExpensesPaidRef(resetUserExpensesPaidVars);
// Variables can be defined inline as well.
const ref = resetUserExpensesPaidRef({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resetUserExpensesPaidRef(dataConnect, resetUserExpensesPaidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.expense_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.expense_updateMany);
});
```

## ResetUserIncomesReceived
You can execute the `ResetUserIncomesReceived` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
resetUserIncomesReceived(vars: ResetUserIncomesReceivedVariables): MutationPromise<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;

interface ResetUserIncomesReceivedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserIncomesReceivedVariables): MutationRef<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;
}
export const resetUserIncomesReceivedRef: ResetUserIncomesReceivedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resetUserIncomesReceived(dc: DataConnect, vars: ResetUserIncomesReceivedVariables): MutationPromise<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;

interface ResetUserIncomesReceivedRef {
  ...
  (dc: DataConnect, vars: ResetUserIncomesReceivedVariables): MutationRef<ResetUserIncomesReceivedData, ResetUserIncomesReceivedVariables>;
}
export const resetUserIncomesReceivedRef: ResetUserIncomesReceivedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resetUserIncomesReceivedRef:
```typescript
const name = resetUserIncomesReceivedRef.operationName;
console.log(name);
```

### Variables
The `ResetUserIncomesReceived` mutation requires an argument of type `ResetUserIncomesReceivedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ResetUserIncomesReceivedVariables {
  householdId: UUIDString;
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ResetUserIncomesReceived` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResetUserIncomesReceivedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResetUserIncomesReceivedData {
  income_updateMany: number;
}
```
### Using `ResetUserIncomesReceived`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resetUserIncomesReceived, ResetUserIncomesReceivedVariables } from '@hogar-finance/dataconnect';

// The `ResetUserIncomesReceived` mutation requires an argument of type `ResetUserIncomesReceivedVariables`:
const resetUserIncomesReceivedVars: ResetUserIncomesReceivedVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserIncomesReceived()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resetUserIncomesReceived(resetUserIncomesReceivedVars);
// Variables can be defined inline as well.
const { data } = await resetUserIncomesReceived({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resetUserIncomesReceived(dataConnect, resetUserIncomesReceivedVars);

console.log(data.income_updateMany);

// Or, you can use the `Promise` API.
resetUserIncomesReceived(resetUserIncomesReceivedVars).then((response) => {
  const data = response.data;
  console.log(data.income_updateMany);
});
```

### Using `ResetUserIncomesReceived`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resetUserIncomesReceivedRef, ResetUserIncomesReceivedVariables } from '@hogar-finance/dataconnect';

// The `ResetUserIncomesReceived` mutation requires an argument of type `ResetUserIncomesReceivedVariables`:
const resetUserIncomesReceivedVars: ResetUserIncomesReceivedVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserIncomesReceivedRef()` function to get a reference to the mutation.
const ref = resetUserIncomesReceivedRef(resetUserIncomesReceivedVars);
// Variables can be defined inline as well.
const ref = resetUserIncomesReceivedRef({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resetUserIncomesReceivedRef(dataConnect, resetUserIncomesReceivedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.income_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.income_updateMany);
});
```

## ResetUserCardsPaid
You can execute the `ResetUserCardsPaid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
resetUserCardsPaid(vars: ResetUserCardsPaidVariables): MutationPromise<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;

interface ResetUserCardsPaidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResetUserCardsPaidVariables): MutationRef<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;
}
export const resetUserCardsPaidRef: ResetUserCardsPaidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
resetUserCardsPaid(dc: DataConnect, vars: ResetUserCardsPaidVariables): MutationPromise<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;

interface ResetUserCardsPaidRef {
  ...
  (dc: DataConnect, vars: ResetUserCardsPaidVariables): MutationRef<ResetUserCardsPaidData, ResetUserCardsPaidVariables>;
}
export const resetUserCardsPaidRef: ResetUserCardsPaidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resetUserCardsPaidRef:
```typescript
const name = resetUserCardsPaidRef.operationName;
console.log(name);
```

### Variables
The `ResetUserCardsPaid` mutation requires an argument of type `ResetUserCardsPaidVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ResetUserCardsPaidVariables {
  householdId: UUIDString;
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ResetUserCardsPaid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResetUserCardsPaidData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ResetUserCardsPaidData {
  card_updateMany: number;
}
```
### Using `ResetUserCardsPaid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resetUserCardsPaid, ResetUserCardsPaidVariables } from '@hogar-finance/dataconnect';

// The `ResetUserCardsPaid` mutation requires an argument of type `ResetUserCardsPaidVariables`:
const resetUserCardsPaidVars: ResetUserCardsPaidVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserCardsPaid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resetUserCardsPaid(resetUserCardsPaidVars);
// Variables can be defined inline as well.
const { data } = await resetUserCardsPaid({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resetUserCardsPaid(dataConnect, resetUserCardsPaidVars);

console.log(data.card_updateMany);

// Or, you can use the `Promise` API.
resetUserCardsPaid(resetUserCardsPaidVars).then((response) => {
  const data = response.data;
  console.log(data.card_updateMany);
});
```

### Using `ResetUserCardsPaid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, resetUserCardsPaidRef, ResetUserCardsPaidVariables } from '@hogar-finance/dataconnect';

// The `ResetUserCardsPaid` mutation requires an argument of type `ResetUserCardsPaidVariables`:
const resetUserCardsPaidVars: ResetUserCardsPaidVariables = {
  householdId: ..., 
  userId: ..., 
};

// Call the `resetUserCardsPaidRef()` function to get a reference to the mutation.
const ref = resetUserCardsPaidRef(resetUserCardsPaidVars);
// Variables can be defined inline as well.
const ref = resetUserCardsPaidRef({ householdId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resetUserCardsPaidRef(dataConnect, resetUserCardsPaidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.card_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.card_updateMany);
});
```

