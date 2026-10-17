class ExpressError extends Error {
    constructor(statusCode, message){ //constructor call kiya jaayega
      super();//constructor apne superconstructor ko call karega
      this.statusCode = statusCode;
      this.message = message;
    }
}

module.exports = ExpressError;