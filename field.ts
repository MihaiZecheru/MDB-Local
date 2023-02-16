/**
 * The field type, which is one of the following:
 * 
 * - string: a string of up to 255 characters (default string size)
 * - string_max: a string of up to 10485760 characters (10MB)
 * - string_nolim: a string of unlimited size (sql TEXT)
 * - string_${string}: a string of up to (string) characters, where string is a number between 1 and 10485760; for example, string_1000
 * - integer: an integer between -2147483648 to +2147483647
 * - float: a floating point number between -2147483648 to +2147483647 (referenced as 'real' in the database)
 * - boolean: a boolean value (true or false)
 * - date: a date in the format of YYYY-MM-DD
 * - time: a time in the format of HH:MM:SS
 * - datetime: a datetime in the format of YYYY-MM-DD HH:MM:SS
 * - url: a URL of up to 501 characters
 * - email: an email address of up to 320 characters
 * - phone: a phone number of up to 20 characters
 * - array: an array
 * - json: a JSON object
 * - emoji: an emoji code, for example, :smile:, which is a string of up to 58 characters
 */
export type fieldtype = "string" | "string_max" | "string_nolim" | `string_${number}` | "integer" | "float" | "boolean" | "date" | "time" | "datetime" | "url" | "email" | "phone" | "array" | "json" | "emoji";
export type fieldname = string;

export default class Field {
  public constructor(public name: fieldname, public type: fieldtype, public isNullable: boolean, public defaultValue: any, public isAutoIncrement: boolean) {}
  
  public static fromJSON(json: any): Field {
    return new Field(json.name, json.type, json.isNullable, json.defaultValue, json.isAutoIncrement);
  }

  public toJSON(): any {
    return {
      name: this.name,
      type: this.type,
      isNullable: this.isNullable,
      defaultValue: this.defaultValue,
      isAutoIncrement: this.isAutoIncrement,
    };
  }
}