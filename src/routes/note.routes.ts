import { Router } from "express";
import Note from "../models/Note";
import { authRequired, AuthedRequest } from "../middleware/auth";

const router = Router();

router.use(authRequired);

// get request for notes 

router.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const notes = await Note.find({ 
        userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(notes);

  } catch (e) { next(e); }
});


// post request to save notes 

router.post("/", async (req: AuthedRequest, res, next) => {

  try {

    const { title, content } = req.body;

    if (!title) return res.status(400).json({ error: "title required" });

    const note = await Note.create({ 
        userId: req.user!.id, 
        title, 
        content: content || "" 
    });

    res.status(201).json(note);
  } catch (e) { next(e); }
});

// delete notes 

router.delete("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Note.findOneAndDelete({ 
        _id: id, 
        userId: req.user!.id 
    });

    if (!deleted) return res.status(404).json({ error: "Note not found" });

    res.json({ ok: true });
    
  } catch (e) { next(e); }
});

export default router;