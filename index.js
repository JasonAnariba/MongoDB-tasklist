const express = require('express');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://jassongomz11:OVFSnsFv3u23yn1r@cluster0.4lcflnl.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(url);

app.get('/', async (req, res)=> {
    try {
       //await client.db("admin").command({ping: 1});
       //console.log("conexion exitosa")
        
        const db = client.db('tareas')
        const collection = db.collection('listas')
        const documentos = await collection.find().toArray();
    
        client.close();
        res.send(documentos)  
} 
 catch (error) {
    console.log('ocurrio un error en tu servidor', error)
    res.status(500).send("Ocurrio un error");
    }  
});

app.post('/', async (req, res) =>{
    const newTask = {
        title:"Nueva tarea ",
        description:" Comprar accesorios",
        status: true
    }
    try {
    await client.connect();
    const db = client.db('tareas')
    const collection = db.collection('listas')
    const document = await collection.insertOne(newTask)

    client.close();
    res.send(document)

    } catch (error) {
        console.log('Error', error)
    }
});

app.put('/:documentId', async (req, res) => {
    const nuevo = {
        title: "Nueva tarea",
        description: "Comprar medicinas ",
        status: true
    }
    try{
        await client.connect();
        const db = client.db('tareas')
        const collection = db.collection('listas')
        const documentId = req.params.documentId;
        const objectId = new ObjectId(documentId);
        const document = await collection.updateOne({_id: objectId}, {$set: nuevo });

        client.close();
        res.send(document)

    } catch (error){
        console.log('Error en el servidor', error)
    }

});

app.delete('/:id', async (req, res) => {
    try {
        const documentId = req.params.id;
        const objectId = new ObjectId(documentId);

        await client.connect();
        const db = client.db('tareas');
        const collection = db.collection('listas');
        const document = await collection.deleteOne({ _id: objectId});

        client.close();
        res.send(document);

    } catch (error) {
        console.log('Error en el servidor', error);
        res.status(500).send('Error en el servidor');
    }
});

app.listen(port,()=>{
    console.log('servidor corriendo en puerto ' + port)
})