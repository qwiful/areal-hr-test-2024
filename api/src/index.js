const express = require("express");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

const organizationsRouter = require("./routers/organizations_router.js")(pool);
app.use("/organizations", organizationsRouter);

const positionsRouter = require("./routers/positions_router.js")(pool);
app.use("/positions", positionsRouter);

const departmentsRouter = require("./routers/departments_router.js")(pool);
app.use("/departments", departmentsRouter);

const workersRouter = require("./routers/workers_router.js")(pool);
app.use("/workers", workersRouter);

const filesRouter = require("./routers/files_router.js")(pool);
app.use("/files", filesRouter);

const personnelOperationsrouter =
  require("./routers/personnel_operations_router.js")(pool);
app.use("/personnel_operations", personnelOperationsrouter);

const historyChangesRouter = require("./routers/history_changes_router.js")(
  pool
);
app.use("/history_changes", historyChangesRouter);

app.get("/", (req, res) => {
  res.send(
    "Для запуска пропишите путь в строке поиска (Пример: http://localhost:3000/organizations)"
  );
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
