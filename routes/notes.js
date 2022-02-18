const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');



// ROUTE 1 : Get all the notes using : GET /api/notes/fetchallnotes ,  **require login
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }

})

// ROUTE 2 : Adding a new note using : POST /api/notes/addnote ,  **require login
router.post('/addnote', fetchuser, [

], async (req, res) => {

    try {

        const { title, description, tag } = req.body
        // If there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(note)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }

})


// ROUTE 3 : Updating an exisrting note using : PUT /api/notes/updatenote/:id ,  **require login
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {

        //Create a new note object
        let newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };


        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.send(note);
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }
})


// ROUTE 4 : Deleting an exisrting note using : DELETE /api/notes/deletenote/:id ,  **require login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") };

        //Checking is the user logged in Own this or not 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note has been deleted", note : note});

    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server error")
    }
})


module.exports = router