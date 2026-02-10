import { createBrowserRouter, Outlet } from "react-router";
import AgentPool from "./agent-pool";
import JobDetail from "./job-detail";
import Overview from "./overview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        Component: Overview,
      },
      {
        path: "agents",
        Component: AgentPool,
      },
      {
        path: "jobs/:jobId",
        Component: JobDetail,
      },
    ]
  },
]);

export default router;
