import fs from 'fs';
import Field from './field';
import { Schema } from "./schema";

export class Table {
  public schema_path: string;

  public constructor(public name: string, public schema: Schema, public table_path: string) {
    this.schema_path = table_path + '\\.schema';
  }

  public createEntry(entry: any): void {
    if (!this.schema.validate(entry)) {
      console.error('Invalid entry'); return;
    }

    // Get entry id
    entry.id = 1;
    fs.readdirSync(this.table_path).forEach((file: string) => {
      if (file === '.schema') return;

      const id = parseInt(file);
      if (isNaN(id)) return;

      entry.id = id + 1;
    });

    fs.writeFileSync(this.table_path + '\\' + entry.id, this.format(entry));
  }

  private format(entry: any): string {
    // Will look like this: key=value
    let formatted = '';
    for (const key in entry) {
      formatted += `${key}=${entry[key]}\n`;
    }

    // Move "id" to the beginning
    const id = formatted.match(/id=\d+/);
    if (id) {
      formatted = formatted.replace(id[0], '');
      formatted = id[0] + '\n' + formatted;
    }

    // remove final \n
    return formatted.substring(0, formatted.length - 2);
  }

  public getEntry(id: number): any | undefined {
    const entry_path = this.table_path + '\\' + id;
    if (!fs.existsSync(entry_path)) return;

    const entry_str = fs.readFileSync(entry_path).toString();

    const entry: { [key: string]: unknown } = {};
    entry_str.split('\n').forEach((line: string) => {
      const [key, value] = line.split('=');
      if (key) entry[key] = value;

      // Make type convsersion if possible
      if (key === 'id') entry[key] = parseInt(value as string);
      const _f = this.schema.fields.find((f: Field) => f.name === key);
      if (_f) {
        switch (_f.type) {
          case 'integer':
            entry[key] = parseInt(value as string);
            break;
          case 'float':
            entry[key] = parseFloat(value as string);
            break;
          case 'boolean':
            entry[key] = value === 'true';
            break;
          case 'array':
          case 'json':
            entry[key] = JSON.parse(value as string);
            break;
        }
      }
    });

    return entry;
  }

  public getAll(): Array<any> {
    const entries: Array<any> = [];
    fs.readdirSync(this.table_path).forEach((file: string) => {
      if (file === '.schema') return;

      const id = parseInt(file);
      if (isNaN(id)) return;

      const entry = this.getEntry(id);
      if (entry) entries.push(entry);
    });

    return entries;
  }

  public searchEntries(func: (entry: any) => boolean): Array<any> {
    const entries: Array<any> = [];
    fs.readdirSync(this.table_path).forEach((file: string) => {
      if (file === '.schema') return;

      const id = parseInt(file);
      if (isNaN(id)) return;

      const entry = this.getEntry(id);
      if (entry && func(entry)) entries.push(entry);
    });

    return entries;
  }
  
  public toJSON(): any {
    return {
      name: this.name,
      schema: this.schema.toJSON(),
    };
  }
  
  public toCSV(): string {
    return this.schema.toCSV();
  }
}