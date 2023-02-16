import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Table } from './table';
import { Schema } from './schema';
import Field from './field';

require('dotenv').config();

class Database {
  private tables_path: string = "";
  private tablesmap: string = "";
  private tables: Array<Table> = new Array<Table>();
  private initialized: boolean = false;
  
  public constructor(private readonly path: string, private readonly username: string, private readonly password: string) {}

  public async connect(): Promise<void> {
    // Check if the database exists
    if (!fs.existsSync(this.path)) {
      console.error('Database does not exist at ' + this.path + "\nUse MDBL_setup.exe to create a new database");
      return;
    }

    // Get internal username and password
    const auth_path = fs.readFileSync(this.path).toString();
    const encrypted_username = fs.readFileSync(auth_path + '/username').toString();
    const encrypted_password = fs.readFileSync(auth_path + '/password').toString();
    
    const db_username = await fetch("https://us-west2-mihai-db-369607.cloudfunctions.net/Decrypt", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encrypted: encrypted_username })
    }).then((r: any) => r.text());

    const db_password = await fetch("https://us-west2-mihai-db-369607.cloudfunctions.net/Decrypt", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encrypted: encrypted_password })
    }).then((r: any) => r.text());

    // Attempt login
    if (this.username !== db_username || this.password !== db_password) {
      console.error('Invalid username or password'); return;
    } else {
      console.log(`Successfully logged in to '${this.path}' as '${this.username}'`);
    }

    this.tables_path = auth_path.substring(0, auth_path.length - 4) + 'tables';
    this.tablesmap = this.tables_path + '.map';

    // Load tables
    /* tablemap var will look like this
      [
        [
          'test',
          'Z:\\main\\programming\\js\\other\\mdb_local\\Example-DB\\tables\\test\\.schema'
        ]
      ]
    */
    this.assertMapFile();
    const tablemap: Array<Array<string>> = fs.readFileSync(this.tablesmap).toString().split('\n').filter((line: string) => line !== "").map((line: string) => line.split('='));

    tablemap.forEach((table: Array<string>) => {
      const schema_path = table[1];
      const data = parse(fs.readFileSync(schema_path), {columns: true});
      this.tables.push(new Table(table[0], new Schema(...data.map((field: any) => new Field(field.name, field.type, field.isNullable, field.defaultValue, field.isAutoIncrement))), this.tables_path + '\\' + table[0]));
    });

    this.initialized = true;
  }

  private notInitialized(): boolean {
    if (!this.initialized) {
      console.error('Database not initialized'); return true;
    } else return false;
  }

  private assertMapFile(): void {
    if (!fs.existsSync(this.tablesmap))
      fs.closeSync(fs.openSync(this.tablesmap, 'w'));
  }

  public createTable(name: string, schema: Schema): Table | undefined {
    if (this.notInitialized()) return;

    if (/[^\w\-_]+/.test(name)) {
      console.error('Table name must be alphanumeric'); return;
    }
    
    this.assertMapFile();
    let table_path, schema_path, tablemap_path;

    try {
      table_path = this.tables_path + '\\' + name;
      fs.mkdirSync(table_path);

      schema_path = table_path + '\\.schema';
      fs.writeFileSync(schema_path, schema.toCSV());
    } catch (e) {
      console.error('Table already exists'); return;
    }

    // Add to map
    const tablemap = fs.readFileSync(this.tablesmap).toString();
    fs.writeFileSync(this.tablesmap, tablemap + `${name}=${schema_path}\n`);

    const table = new Table(name, schema, table_path);
    this.tables.push(table);
    return table;
  }

  public getTable(name: string): Table | undefined {
    return this.tables.find((t: Table) => t.name === name);
  }
}

function main() {
  // db.createTable('test', new Schema(
  //   new Field('id', 'integer', false, true, true),
  //   new Field('name', 'string', false, false, false),
  //   new Field('age', 'integer', false, false, false)
  // ));

  const t = db.getTable('test') as Table;
  // t.createEntry({ name: 'Mihai', age: 15 });
  // const entry = t.getEntry(1); // First entry, file '1'
  const entry = t.searchEntries((entry: any) => entry.name === 'Mihai');
  console.log("entry", entry);
}

const db = new Database(<string>process.env.DB_PATH, <string>process.env.DB_USERNAME, <string>process.env.DB_PASSWORD);
db.connect().then(main);