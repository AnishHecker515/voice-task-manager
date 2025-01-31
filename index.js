const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/voiceTaskManager', { useNewUrlParser: true, useUnifiedTopology: true });

// Task Schema
const taskSchema = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.get('/', (req, res) => {
    res.render('home'); 
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ timestamp: -1 });
    res.render('tasks', { tasks });
});

app.post('/upload', upload.single('audio'), async (req, res) => {
    // Here you would call the Deepgram API to transcribe the audio
    // For now, we'll just simulate a transcription
    const transcribedText = "Simulated task from audio";

    const newTask = new Task({ text: transcribedText });
    await newTask.save();

    res.redirect('/tasks');
});

app.post('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});