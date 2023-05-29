# MDB-Local
Simple database using local system files. An easier version of SQL. Includes API for interacting with the database.

Good for small projects that don't require a serious database.

The database tables' fields are type-less, meaning you can store whatever value you want and then parse it yourself.

To parse entries, you can use the `table.set_parse_function` function to define the function used to automatically parse
all entries returned from any of the API calls:

TS:
```ts
import Database, { Entry } from "./mdb_local/index";

const table: Table = Database.get_table("Users");
table.set_parse_function((entry: Entry) => {
  entry.age = parseInt(entry.age);
  entry.created_on = new Date(entry.created_on);
  return entry;
});
```

JS:
```
import Database from "./mdb_local/index";

const table = Database.get_table("Users");
table.set_parse_function((entry) => {
  entry.age = parseInt(entry.age);
  entry.created_on = new Date(entry.created_on);
  return entry;
});
```

----------------------------------------------------------------------------------------------------------------------

# Use MDB-Local

To use MDB Local, copy the `index.ts` file and the `TableFunctions` folder to your project.

Setup your tables using the executables in the `TableFunctions` folder then import the `index.ts` file and connect the database:

TS/JS
```
import Database from "./mdb_local/index";
Database.connect();
```
