import fs from 'fs';

class Database {
  constructor(private readonly path: string, private readonly user: string, private readonly password: string) {}

  connect() {
    // Check if the database exists
    if (!fs.existsSync(this.path)) {
      console.error('Database does not exist at ' + this.path + "\n\nUse MDBL_setup.exe to create a new database");
    }
  }
}

const db = new Database('C:\\Users\\User\\Documents\\MyDatabase.mdb', 'admin', 'password');