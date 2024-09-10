const fastify = require("fastify")({ logger: true, connectionTimeout: 5000 });
const requestTracker = require("./utils/requestTracker");
const { WorkerClass } = require("./classes/WorkerClass.js");
const correlationIdPlugin = require("./plugins/correlationIdPlugin");

// Register the plugin (Task #2)
fastify.register(correlationIdPlugin);

// Worker get created as a Class (Task #3)
let catsWorker = new WorkerClass("getCatsWorker");
let dogsWorker = new WorkerClass("getDogsWorker");

console.log("-> catsWorker and dogsWorker is being created");

fastify.get("/getCatsInfo", function handler(request, reply) {
  requestTracker[request.id] = (result) => reply.send(result);

  if (catsWorker.workerTerminated) {
    catsWorker = new WorkerClass("getCatsWorker");
    console.log("-> getCatsWorker is being created");
  }
  catsWorker.worker.postMessage({ requestId: request.id });
  catsWorker.resetIdleTimeout();
});

fastify.get("/getDogsInfo", function handler(request, reply) {
  requestTracker[request.id] = (result) => reply.send(result);

  if (dogsWorker.workerTerminated) {
    dogsWorker = new WorkerClass("getDogsWorker");
    console.log("-> getDogsWorker is being created");
  }
  dogsWorker.worker.postMessage({ requestId: request.id });
  dogsWorker.resetIdleTimeout();
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
