const { parentPort } = require("worker_threads");
const mockFetch = require("../utils/mockFetch");

/*
- The 'dogs' API doesn't need token, so we can directly call the 'mockFetch' function.
*/
const handleResponse = async (message) => {
  const requestId = message.requestId;
  const response = await mockFetch("dogs");
  parentPort.postMessage({ response, requestId });
};

/*
- Process the request from the main thread, and respond back with the data.
*/
parentPort.on("message", async (message) => {
  if (message === "terminate") {
    process.exit(0);
  } else {
    await handleResponse(message);
  }
});
