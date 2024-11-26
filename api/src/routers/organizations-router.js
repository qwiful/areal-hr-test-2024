const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const organizationsController =
    require("../controllers/organizations-controller.js")(pool);

  router.post("/", organizationsController.createOrganization);
  router.get("/", organizationsController.getOrganizations);
  router.get("/:id", organizationsController.getOrganizationById);
  router.put("/:id", organizationsController.updateOrganization);
  router.delete("/:id", organizationsController.deleteOrganization);

  return router;
};
