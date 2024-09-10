## Developer name: Tomer Doar

## Email: tomerdoar@hotmail.com

# Set-up

Run the below commands to set up the project:

```bash
npm i
npm start
```

It will start the server on port 3000. You can access the APIs using the below URLs:

- getCatsInfo: http://localhost:3000/getCatsInfo
- getDogsInfo: http://localhost:3000/getDogsInfo

## Answers:

## Task 1 - Identify and fix the issue with getCatsInfo API

The reason for the bug is because in getCatsInfo.js file at the refreshToken correlationId inside the try we are trying to access data.value.key, but data.value doesn't exist. Therefore this error is being catch and the error is being thrown. Since it is being thrown, it goes to the worker.on(Error) in the generateNewWorker file, and the worker is being terminate.

To fix this bug I was doing a change in the getCatsWorker.js file. I change the call for invokeTokenService by passing the key from data instated of data.value.

## Task 2 - Add correlationId header to all the requests and response

In this task, to add correlationId header in all the requests and response I used the 'fastify-plugin' package.
I created a new file plugins/correlationIdPlugin.js. In this file I check if there is already correlationId on the header or not. I generate a new Id if needed and add it to the request header. In addition, I also add it to the response. I use the 'uuid' package for generating a new correlationId.
In the index.js I register the plugin to the fastify app.
As a results, all the requests and responses will have a uniq correlationId.

## Task 3 - Terminate the idle worker and recreate when needed

In this task, I had to change the way the worker gets created. I created a class called classes/WorkerClass.js. The contractor of this class gets the worker file name and create the worker (same as the function). The reason I put the worker in a class is because I needed the functionally for terminating the worker after 15 minuets, so I added a function in the class called resetIdleTimeout that will terminate the worker if it was been idle for 15 minuets. I also added a flag in the class to be true if the worked got terminated.
When there is a request, the flag is being checked. If its false, the message is being post, however, if it true, a new class is getting generated and after that the message is being post. After the message is being post, a timer is getting reset for 15 minuets. If there are no request withing those 15 minuets, the worker is getting terminated and the flag is true.

The files that was change are:
index.js: worker gets created as a class for the getCatsInfo and the getDogsInfo API. When there a request, the workerTerminated flag in the class is being checked. If its true creating a new class and posting the message. If its false, posting the message to the existing class. After the post message, the resetIdleTimeout function in the class is being called to terminate the worker after 15 minutes if there are no requests.

classes/WorkerClass.js: This is the calls that generate the worker. The worker is being generated in the constructor. The class has the worker, a flag for terminated and a function resetIdleTimeout to count 15 minutes of idle worker and to terminate it after that time.

workers/getCatsWorker.js / workers/getDogsWorker.js: When the parentPort received a message, check if its 'terminate'. If it is, exiting the process, however, if its not, continuing and handling the message.
