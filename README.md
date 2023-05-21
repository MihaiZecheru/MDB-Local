# MDB-Local
Mini database using local system files. Includes API for interacting with the database.

Good for small projects that don't require a serious database.

The database tables' fields are type-less, meaning you can store whatever value you want and then parse it yourself.

To parse entries, you can use the Table.set_parse_function to define the function used to automatically parse
all entries returned from any of the API calls.
