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
}