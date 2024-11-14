const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const history_changes_controller =
    require("../controllers/history_changes_controller.js")(pool);

  router.post("/", history_changes_controller.create_change);
  router.get("/", history_changes_controller.get_changes);
  router.get("/:id", history_changes_controller.get_change_id);
  router.put("/:id", history_changes_controller.update_change);
  router.delete("/:id", history_changes_controller.delete_change);

  return router;
};
