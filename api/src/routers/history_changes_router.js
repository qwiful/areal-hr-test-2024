const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const historyChangesController =
    require("../controllers/history_changes_controller.js")(pool);

  router.get("/", historyChangesController.getChanges);
  router.get("/:id", historyChangesController.getChangeById);

  return router;
};
