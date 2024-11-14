const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const departments_controller =
    require("../controllers/departments_controller.js")(pool);

  router.post("/", departments_controller.create_department);
  router.get("/", departments_controller.get_departments);
  router.get("/:id", departments_controller.get_department_id);
  router.put("/:id", departments_controller.update_department);
  router.delete("/:id", departments_controller.delete_department);

  return router;
};
