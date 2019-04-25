export class Cancel {
  public __CANCEL__: boolean;

  constructor(public message = "Cancel") {}

  public toString() {
    return this.message;
  }
}

Cancel.prototype.__CANCEL__ = true;

export default Cancel;
