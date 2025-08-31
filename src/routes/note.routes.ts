import { Router, RequestHandler } from "express";
import { authRequired, AuthedRequest } from "../middleware/auth";
import Note from "../models/Note";

const router = Router();

// ✅ protect all routes with auth middleware
router.use(authRequired);

// ✅ GET all notes for logged-in user
router.get(
  "/",
  (async (req: AuthedRequest, res) => {
    try {
      const notes = await Note.find({ user: req.user.id });
      res.json(notes);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  }) as RequestHandler
);

// ✅ CREATE a note
router.post(
  "/",
  (async (req: AuthedRequest, res) => {
    try {
      const note = await Note.create({
        ...req.body,
        user: req.user.id,
      });
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ message: "Failed to create note" });
    }
  }) as RequestHandler
);

// ✅ DELETE a note
router.delete(
  "/:id",
  (async (req: AuthedRequest, res) => {
    try {
      await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      res.json({ message: "Note deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  }) as RequestHandler
);

export default router;
