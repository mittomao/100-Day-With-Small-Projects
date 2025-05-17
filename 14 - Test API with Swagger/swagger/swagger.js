const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
        title: "Express + Swagger",
        version: "1.0.0",
        description: "Testing and working with APIs with Express + Swagger",
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
