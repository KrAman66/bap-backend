class appResponse {
  constructor(message = "Success", data = null, details = undefined) {
    this.status = "success";
    this.statusCode = 200;
    this.message = message;
    this.data = data;
    this.details = details;
  }
}

module.exports = appResponse;
