import dashboardFunction from "./dashboard.js";
import { List } from "./menu.js";
import { createNewElement } from "./validation.js";
import { initAiAgent } from "./ai-agent.js";

List();
createNewElement();
dashboardFunction();
initAiAgent();