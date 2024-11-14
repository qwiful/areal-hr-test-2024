const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const workers_controller = require("../controllers/workers_controller.js")(
    pool
  );

  router.post("/", workers_controller.create_worker);
  router.get("/", workers_controller.get_workers);
  router.get("/:id", workers_controller.get_worker_id);
  router.put("/:id", workers_controller.update_worker);
  router.delete("/:id", workers_controller.delete_worker);

  return router;
};
