import express from "express";
import bodyParser from "body-parser";
import { sendRequest } from "./queues/request.queue";
import * as dotenv from "dotenv";
import { router } from "bull-board";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/admin/queues", router);

app.post("/test-request", async (req, res, next) => {
  try {
    const { message, customerId } = req.body;

    if (!customerId) {
      console.log(
        "Invalid arguments. Request body: " + JSON.stringify(req.body)
      );
      res.status(400).send("Invalid arguments");
      return;
    }

    const result = await sendRequest({
      customerId,
      message,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

const appPort = 5000;

app.listen(appPort, () => console.log(`App running on port ${appPort}`));

// for (let i = 0; i < 20; i++) {
//   sendRequest({
//     message: "some input message",
//     customerId: "12345",
//   }).then((response) => {
//     console.log("job result: " + JSON.stringify(response));
//   });
// }
