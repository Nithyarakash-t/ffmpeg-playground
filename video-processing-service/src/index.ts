import express from 'express';
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(express.json());

app.post('/process-video',(req, res)=>{
    //Get path of the input video from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    //in case of missing paths
    if(!inputFilePath || !outputFilePath) {
        console.log('Bad request');
        res.status(400).send(`Bad Request: Missing ${inputFilePath ? '' : 'Input file path, '}${ outputFilePath ? '' : 'Output File Path'}.`)
    }

    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') //360p
        .on('end', ()=>{
            console.log('Processed successfully');
            res.status(200).send('Processed successfully');
        })
        .on('error', (err)=>{
            console.log('Error: ', err.message)
            res.status(500).send(`Internal Server Error: ${err.message}`)
        })
        .save(outputFilePath);
});

const port = process.env.PORT ?? 3000;

app.listen(port, ()=>{
    console.log(`Listening at ${port}`);
});