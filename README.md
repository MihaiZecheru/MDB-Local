# MDB-Local
Simple database using local system files. An easier version of SQL. Includes API for interacting with the database.

Good for small projects that don't require a serious database.

The database tables' fields are type-less, meaning you can store whatever value you want and then parse it yourself.

To parse entries, you can use the `table.set_parse_function` function to define the function used to automatically parse
all entries returned from any of the API calls:

TypeScript
```ts
import Database, { Table, TEntry } from "./mdb_local/index";

const table: Table = Database.get_table("Users");
table.set_parse_function((entry: TEntry) => {
  entry.age = parseInt(entry.age);
  entry.created_on = new Date(entry.created_on);
  return entry;
});
```

JavaScript:
```js
import Database from "./mdb_local/index";

const table = Database.get_table("Users");
table.set_parse_function((entry) => {
  entry.age = parseInt(entry.age);
  entry.created_on = new Date(entry.created_on);
  return entry;
});
```

Alternatively, entries can be parsed by returning a new object:
```ts
import Database, { Table, TEntry } from "./mdb_local/index";

const table: Table = Database.get_table("Users");
table.set_parse_function((entry: TEntry) => {
  return {
    age: parseInt(entry.age),
    created_on: new Date(entry.created_on)
  };
});
```

----------------------------------------------------------------------------------------------------------------------

# Use MDB-Local

To use MDB Local, copy the `index.ts` file and the `TableFunctions` folder to your project.

Setup your tables using the executables in the `TableFunctions` folder then import the `index.ts` file and connect the database:

TypeScript/JavaScript
```js
import Database from "./mdb_local/index";
Database.connect();
```
