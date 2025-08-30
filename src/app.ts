import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import { errorHandler } from "./middleware/error";

const app = express();

// ✅ Update CORS to allow your Netlify frontend
app.use(
  cors({
    origin: ["https://effulgent-toffee-39d81c.netlify.app"], // your frontend URL
    credentials: true,
  })
);

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
