import Bull from "bull";
import requestProcess from "../processes/request.process";
import { setQueues, BullAdapter } from "bull-board";
import { createJobPromise } from "../services/jobs.service";
import { RequestData } from "../types/request.types";
import { ResponseResult } from "../types/response.types";
import {
  getCustomerId,
  getCustomerConcurrency,
} from "../services/customer.service";

// https://optimalbits.github.io/bull

const queues: Record<string, Bull.Queue> = {};

const sendRequest = async (data: RequestData): Promise<ResponseResult> => {
  const customerId = getCustomerId(data);

  let requestQueue = queues[customerId];

  if (!requestQueue) {
    requestQueue = new Bull(customerId, {
      redis: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT || 6379),
      },
    });

    setQueues([new BullAdapter(requestQueue)]);

    queues[customerId] = requestQueue;

    const customerCuncurrency = getCustomerConcurrency(customerId);

    requestQueue.process(customerCuncurrency, requestProcess);

    console.log(`queue=${customerId} concurrency=${customerCuncurrency}`);
  }

  const job = await requestQueue.add(data);
  const jobPromise = createJobPromise<ResponseResult>(job.id);

  return jobPromise;
};

export { sendRequest };
