import fs from 'fs';
import { Table } from './table';
require('dotenv').config();

class Database {
  private tables_path: string = "";
  private tables: Array<Table> = new Array<Table>();
  
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
  }
}

const db = new Database(<string>process.env.DB_PATH, <string>process.env.DB_USERNAME, <string>process.env.DB_PASSWORD);
db.connect();
