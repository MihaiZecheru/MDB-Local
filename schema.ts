import Field from "./field";

export class Schema {
  public fields: Array<Field> = new Array<Field>();
  
  constructor(...fields: Array<Field>) {
    this.fields = fields;
  }

  public addField(field: Field): void {
    this.fields.push(field);
  }

  public removeField(field: Field): void {
    this.fields = this.fields.filter((f: Field) => f !== field);
  }

  public getField(name: string): Field | undefined {
    return this.fields.find((f: Field) => f.name === name);
  }

  public validate(entry: any): boolean {
    return this.fields.every((f: Field) => f.validate(entry[f.name]));
  }

  public toJSON(): any {
    let d = {};
    // @ts-ignore
    this.fields.forEach((f: Field) => d[f.name] = f.toJSON());
    return d;
  }

  public toCSV(): string {
    return this.fields.reduce((acc, f: Field) => { return acc + `${f.name},${f.type},${f.isNullable},${f.defaultValue},${f.isAutoIncrement}\n` }, "name,type,isNullable,defaultValue,isAutoIncrement\n");
  }
}