const { Worker } = require("worker_threads");
const path = require("path");
const requestTracker = require("../utils/requestTracker");

const IDLE_TIME_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

class WorkerClass {
  constructor(workerName) {
    this.name = workerName;
    this.worker = new Worker(path.join(__dirname, "../workers", workerName));
    this.idleTimeout = null;
    this.workerTerminated = false;

    this.worker.on("message", (data) => {
      const { response, requestId } = data;
      requestTracker[requestId](response);
      delete requestTracker[requestId];
    });
    this.worker.on("error", () => {
      this.worker.terminate();
    });
  }

  resetIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout); // Clear previous timeout
    }

    this.idleTimeout = setTimeout(() => {
      console.log(`Terminating ${this.name} due to inactivity`);
      this.worker.postMessage("terminate");
      this.worker.terminate();
      this.workerTerminated = true;
    }, IDLE_TIME_LIMIT);
  }
}

module.exports = { WorkerClass };
