const fp = require("fastify-plugin");
const { v4: uuidv4 } = require("uuid"); // For generating unique correlation IDs

// Create the plugin
const correlationIdPlugin = fp(async (fastify, opts) => {
  fastify.addHook("onRequest", (request, reply, done) => {
    // Check if correlation ID is present in the headers
    let correlationId = request.headers["correlation-id"] || uuidv4();

    // Add the correlation ID to the request header object
    request.headers.correlationId = correlationId;

    // Set the correlation ID in the response headers
    reply.header("correlation-id", correlationId);

    done();
  });
});

module.exports = correlationIdPlugin;
