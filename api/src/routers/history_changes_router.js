const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const historyChangesController =
    require("../controllers/history_changes_controller.js")(pool);

  router.post("/", historyChangesController.createChange);
  router.get("/", historyChangesController.getChanges);
  router.get("/:id", historyChangesController.getChangeById);
  router.put("/:id", historyChangesController.updateChange);
  router.delete("/:id", historyChangesController.deleteChange);

  return router;
};
