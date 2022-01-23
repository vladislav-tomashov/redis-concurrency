import { JobId } from "bull";

export type ResponseResult = {
  data: string;
  jobId: JobId;
};
