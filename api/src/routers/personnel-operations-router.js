const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const personnelOperationsController =
    require("../controllers/personnel-operations-controller.js")(pool);

  router.post("/", personnelOperationsController.createOperation);
  router.get("/", personnelOperationsController.getOperations);
  router.get("/:id", personnelOperationsController.getOperationById);
  router.put("/:id", personnelOperationsController.updateOperation);
  router.delete("/:id", personnelOperationsController.deleteOperation);

  return router;
};
