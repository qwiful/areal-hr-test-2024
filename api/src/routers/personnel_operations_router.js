const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const personnel_operations_controller =
    require("../controllers/personnel_operations_controller.js")(pool);

  router.post("/", personnel_operations_controller.create_operation);
  router.get("/", personnel_operations_controller.get_operations);
  router.get("/:id", personnel_operations_controller.get_operation_id);
  router.put("/:id", personnel_operations_controller.update_operation);
  router.delete("/:id", personnel_operations_controller.delete_operation);

  return router;
};
