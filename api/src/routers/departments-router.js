const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const departmentsController =
    require("../controllers/departments-controller.js")(pool);

  router.post("/", departmentsController.createDepartment);
  router.get("/", departmentsController.getDepartments);
  router.get("/:id", departmentsController.getDepartmentById);
  router.put("/:id", departmentsController.updateDepartment);
  router.delete("/:id", departmentsController.deleteDepartment);

  return router;
};
