exports.errorObj = class ErrorObj {
  constructor(
    msg = 'Something went wrong',
    id = 'TASK FAILURE',
    type = 'ERROR',
  ) {
    this.msg = msg;
    this.id = id;
    this.type = type;
  }
};
