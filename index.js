// index.js
import dashboardFunction from "./dashboard.js";
import { List } from "./menu.js";
import { createNewElement } from "./validation.js";
import "./ai-agent.js"; // Просто импортируем файл, чтобы он выполнил свой код

List();
createNewElement();
dashboardFunction();