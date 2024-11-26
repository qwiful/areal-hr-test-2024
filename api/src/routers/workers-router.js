const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const workersController = require("../controllers/workers-controller.js")(
    pool
  );

  router.post("/", workersController.createWorker);
  router.get("/", workersController.getWorkers);
  router.get("/:id", workersController.getWorkerById);
  router.put("/:id", workersController.updateWorker);
  router.delete("/:id", workersController.deleteWorker);

  return router;
};
