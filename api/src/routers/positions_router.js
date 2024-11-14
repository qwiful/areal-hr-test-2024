const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const positions_controller =
    require("../controllers/positions_controller.js")(pool);

  router.post("/", positions_controller.create_position);
  router.get("/", positions_controller.get_positions);
  router.get("/:id", positions_controller.get_position_id);
  router.put("/:id", positions_controller.update_position);
  router.delete("/:id", positions_controller.delete_position);

  return router;
};
