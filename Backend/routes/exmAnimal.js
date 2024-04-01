const express = require('express');
const router = express.Router();
const Animaldb2 = require('../models/vacAnim');
const AnimalRegistry = require('../models/animalreg');
const ExamAnim = require('../models/exmAnim');

// Create and save a new animal
router.post("/create", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ success: false, message: "Request body cannot be empty" });
        }

        const { earTag, currentStatus, exam, checkdate } = req.body;

        if (!earTag || !currentStatus || !exam || !checkdate ) {
            return res.status(400).send({ success: false, message: "All fields are required" });
        }

        // Check if the ear tag exists in the AnimalRegistry schema
        const animalExists = await AnimalRegistry.findOne({ earTag });
        if (!animalExists) {
            return res.status(400).send({ success: false, message: "Ear tag does not exist" });
        }

        const cow = new ExamAnim({
            earTag,
            currentStatus,
            exam,
            checkdate,
        });

        const data = await cow.save();
        res.status(201).send({ success: true, message: "Data added successfully", data });
    } catch (error) {
        console.error("Error creating animal:", error);
        res.status(500).send({ success: false, message: "Error occurred while creating", error: error.message });
    }
});

// Retrieve and return all animals
router.get('/retrieve', async (req, res) => {
    try {
        const data = await ExamAnim.find({});
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occurred while retrieving" });
    }
});

// Retrieve an animal by id
router.get('/retrieve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await ExamAnim.findById(id);
        if (!animal) {
            return res.status(404).send({ message: `Animal with id ${id} not found` });
        }
        res.json({ success: true, data: animal });
    } catch (error) {
        res.status(500).send({ message: `Error retrieving animal: ${error.message}` });
    }
});

//Retrive pregnant
router.get('/retrieve2/pregnant', async (req, res) => {
    try {
        const cows = await ExamAnim.find({ exam: 'Pregnancy Check' });
        res.json({ success: true, data: cows });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occurred while retrieving" });
    }
});

// Update an animal by id
router.put('/update/:id', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: "Data to update can not be empty" });
        }
        
        const id = req.params.id;
        const updatedAnimal = await ExamAnim.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if (!updatedAnimal) {
            res.status(400).send({ message: `Cannot update cow with id ${id}. May be not found` });
        } else {
            // Fetch the updated animal from the database to include in the response
            const updatedData = await ExamAnim.findById(id);
            res.status(200).json({ success: true, message: "Animal updated successfully", data: updatedData });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating cow" });
    }
});

// Delete an animal by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnimal = await ExamAnim.findByIdAndDelete(id);
        if (!deletedAnimal) {
            return res.status(404).send({ message: `Cannot delete with id ${id}. May be wrong` });
        }
        res.status(200).send({ success: true, message: "Animal deleted successfully", deletedAnimal });
    } catch (error) {
        res.status(500).send({ message: `Couldn't delete: ${error.message}` });
    }
});

// Index route - send a JSON response
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Examination API' });
});

module.exports = router;