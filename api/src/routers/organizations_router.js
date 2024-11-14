const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const organizations_controller =
    require("../controllers/organizations_controller.js")(pool);

  router.post("/", organizations_controller.create_organization);
  router.get("/", organizations_controller.get_organizations);
  router.get("/:id", organizations_controller.get_organization_id);
  router.put("/:id", organizations_controller.update_organization);
  router.delete("/:id", organizations_controller.delete_organization);

  return router;
};
