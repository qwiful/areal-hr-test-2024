const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  const positionsController = require("../controllers/positions-controller.js")(
    pool
  );

  router.post("/", positionsController.createPosition);
  router.get("/", positionsController.getPositions);
  router.get("/:id", positionsController.getPositionById);
  router.put("/:id", positionsController.updatePosition);
  router.delete("/:id", positionsController.deletePosition);

  return router;
};
