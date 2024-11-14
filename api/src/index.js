const express = require("express");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

const organizations_router = require("./routers/organizations_router.js")(pool);
app.use("/organizations", organizations_router);

const positions_router = require("./routers/positions_router.js")(pool);
app.use("/positions", positions_router);

const departments_router = require("./routers/departments_router.js")(pool);
app.use("/departments", departments_router);

const workers_router = require("./routers/workers_router,js")(pool);
app.use("/workers", workers_router);

const files_router = require("./routers/files_router.js")(pool);
app.use("/files", files_router);

const personnel_operations_router =
  require("./routers/personnel_operations_router.js")(pool);
app.use("/personnel_operations", personnel_operations_router);

const history_changes_router = require("./routers/history_changes_router.js")(
  pool
);
app.use("/history_changes", history_changes_router);

app.get("/", (req, res) => {
  res.send(
    "Для запуска пропишите путь в строке поиска (Пример: http://localhost:3000/organizations)"
  );
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
