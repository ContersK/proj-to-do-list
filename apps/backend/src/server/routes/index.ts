import { Router } from "express";

const router = Router();

router.get("/api/health", (req, res) => {
  res.json({
    message: "Backend funcionando!",
    timestamp: new Date().toISOString(),
  });
});
