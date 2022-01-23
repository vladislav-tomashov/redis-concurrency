import { JobId } from "bull";

const jobs: Record<
  JobId,
  {
    resolve: (value: any | PromiseLike<any>) => void;
    reject: (value: Error | PromiseLike<Error>) => void;
  }
> = {};

const createJobPromise = <T>(jobId: JobId): Promise<T> => {
  if (jobs[jobId]) {
    throw new Error(
      `function 'createJobPromise' was already called for job id=${jobId}`
    );
  }

  return new Promise<T>((resolve, reject) => {
    jobs[jobId] = {
      resolve,
      reject,
    };
  });
};

const resolveJobPromise = <T>(jobId: JobId, result: T): void => {
  const promiseObj = jobs[jobId];

  if (!promiseObj) {
    return;
  }

  delete jobs[jobId];

  promiseObj.resolve(result);
};

const rejectJobPromise = (jobId: JobId, error: Error): void => {
  const promiseObj = jobs[jobId];

  if (!promiseObj) {
    return;
  }

  delete jobs[jobId];

  promiseObj.reject(error);
};

export { createJobPromise, resolveJobPromise, rejectJobPromise };
