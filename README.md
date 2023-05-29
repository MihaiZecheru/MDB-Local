# MDB-Local
Simple database using local system files. An easier version of SQL. Includes API for interacting with the database.

Good for small projects that don't require a serious database.

The database tables' fields are type-less, meaning you can store whatever value you want and then parse it yourself.

To parse entries, you can use the Table.set_parse_function to define the function used to automatically parse
all entries returned from any of the API calls.

----------------------------------------------------------------------------------------------------------------------

To use MDB Local, copy the `index.ts` file and the `TableFunctions` folder to your project.

Setup your tables using the executables in the `TableFunctions` folder then import the `index.ts` file and connect the database:
```
import Database from "./mdb_local/index";
Database.connect();
```
