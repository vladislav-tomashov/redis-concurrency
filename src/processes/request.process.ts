import { Job } from "bull";
import { resolveJobPromise } from "../services/jobs.service";
import { ResponseResult } from "../types/response.types";

const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

let jobsCount = 0;

const requestProcess = async (job: Job): Promise<ResponseResult> => {
  return await new Promise((resolve) => {
    const duration = getRandomInRange(0.5, 10) * 1000;
    jobsCount++;

    console.log(
      `job ${
        job.id
      } started, duration=${duration}, jobsCount=${jobsCount}, args=${JSON.stringify(
        job.data
      )}`
    );

    setTimeout(() => {
      jobsCount--;
      console.log(`job ${job.id} finished, jobsCount=${jobsCount}`);

      const result = {
        data: "success",
        jobId: job.id,
        duration,
      };

      resolve(result);
      resolveJobPromise(job.id, result);
    }, duration);
  });
};

export default requestProcess;
