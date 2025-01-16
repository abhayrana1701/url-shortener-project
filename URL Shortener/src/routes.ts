// src/route.ts
import express from "express";
import urlRoutes from "./routes/url.route"; // Import URL-specific routes
import userRoutes  from "./routes/user.route"; 

const router = express.Router();

// Mount the URL routes under "/api"
router.use("/url", urlRoutes);

router.use("/user", userRoutes);

export default router;
