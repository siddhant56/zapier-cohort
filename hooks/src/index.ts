import express from "express";

const app = express();

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

app.use(express.json());
//hooks.zapier.com/hooks/catch/2134124124/88686

//Password Logic
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  //Store in db a new trigger

  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data: {
        zapId,
        metadata: body,
      },
    });
    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });
  res.json({
    message: "Webhook Recieved",
  });
  //Push it onto a queue , kafka or redis
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
