import fs from 'fs';
require('dotenv').config();

class Database {
  constructor(private readonly path: string, private readonly user: string, private readonly password: string) {}

  connect() {
    // Check if the database exists
    if (!fs.existsSync(this.path)) {
      console.error('Database does not exist at ' + this.path + "\nUse MDBL_setup.exe to create a new database");
    }

    
  }
}

const db = new Database(<string>process.env.DB_PATH, <string>process.env.USERNAME, <string>process.env.PASSWORD);
db.connect();