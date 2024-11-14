const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const filesController = require("../controllers/files_controller.js")(pool);

  router.post("/", filesController.createFile);
  router.get("/", filesController.getFiles);
  router.get("/:id", filesController.getFileById);
  router.put("/:id", filesController.updateFile);
  router.delete("/:id", filesController.deleteFile);

  return router;
};
