# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getHouseholdForMe, registerHousehold, addHouseholdMember, updateHouseholdMember, deleteHouseholdMember, updateUserBudgets, insertExpense, updateExpense, deleteExpense, insertIncome } from '@hogar-finance/dataconnect';


// Operation GetHouseholdForMe: 
const { data } = await GetHouseholdForMe(dataConnect);

// Operation RegisterHousehold:  For variables, look at type RegisterHouseholdVars in ../index.d.ts
const { data } = await RegisterHousehold(dataConnect, registerHouseholdVars);

// Operation AddHouseholdMember:  For variables, look at type AddHouseholdMemberVars in ../index.d.ts
const { data } = await AddHouseholdMember(dataConnect, addHouseholdMemberVars);

// Operation UpdateHouseholdMember:  For variables, look at type UpdateHouseholdMemberVars in ../index.d.ts
const { data } = await UpdateHouseholdMember(dataConnect, updateHouseholdMemberVars);

// Operation DeleteHouseholdMember:  For variables, look at type DeleteHouseholdMemberVars in ../index.d.ts
const { data } = await DeleteHouseholdMember(dataConnect, deleteHouseholdMemberVars);

// Operation UpdateUserBudgets:  For variables, look at type UpdateUserBudgetsVars in ../index.d.ts
const { data } = await UpdateUserBudgets(dataConnect, updateUserBudgetsVars);

// Operation InsertExpense:  For variables, look at type InsertExpenseVars in ../index.d.ts
const { data } = await InsertExpense(dataConnect, insertExpenseVars);

// Operation UpdateExpense:  For variables, look at type UpdateExpenseVars in ../index.d.ts
const { data } = await UpdateExpense(dataConnect, updateExpenseVars);

// Operation DeleteExpense:  For variables, look at type DeleteExpenseVars in ../index.d.ts
const { data } = await DeleteExpense(dataConnect, deleteExpenseVars);

// Operation InsertIncome:  For variables, look at type InsertIncomeVars in ../index.d.ts
const { data } = await InsertIncome(dataConnect, insertIncomeVars);


```