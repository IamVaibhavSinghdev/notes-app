import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(cors());
app.use(express.json());

app.get ("/health", (req, res) => {
    res.json({ ok : true});
});

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use(errorHandler);


export default app;