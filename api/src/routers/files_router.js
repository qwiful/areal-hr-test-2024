const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const files_controller = require("../controllers/files_controller.js")(pool);

  router.post("/", files_controller.create_file);
  router.get("/", files_controller.get_files);
  router.get("/:id", files_controller.get_file_id);
  router.put("/:id", files_controller.update_file);
  router.delete("/:id", files_controller.delete_file);

  return router;
};
