const express = require('express');
const { authentication } = require('../controlers/user.auth.controler');
const listRouter = express.Router();
const {List} = require('../models/list.model');
const { Task } = require('../models');

// Zelimo da vratimo sve liste koje pripadaju prijavljenom korisniku
listRouter.get('/', authentication, (req,res)=>{
    const userId = req.userId;
    List.find({_userId:userId})
        .then(result=>{
            res.status(200).send(result);
        })
        .catch(err=>{
            res.status(404).send('Doslo je do greske: ' , err);
        })
})

//dodavanje nove liste
listRouter.post('/',authentication,(req,res)=>{
    const title = req.body.title;
    const userId = req.userId;
    console.log(userId);
    let newList = new List({
        title:title,
        _userId:userId
    })
    newList.save()
        .then(response=>{
            res.send(response);
        })
        .catch(err=>{
            res.status(500).send(err);
        })
})

//azuriranje vec postojece liste
listRouter.patch('/:id',authentication,(req,res)=>{
    const userId = req.userId;
    List.findOneAndUpdate(
        {_id: req.params.id,_userId:userId},
        {$set:{title:req.body.title}}
    )
    .then(user=>{
        res.send(user)
    })
    .catch(err=>{
        console.log('Doslo je do greske ' + err);
    })
})

//brisanje jedne liste
listRouter.delete('/:id',(req,res)=>{
    const listId = req.params.id;
    // ne zelimo da obrisemo samo listu vec i sve zadatke te liste
    List.findByIdAndDelete(
        {listId }
    )
    .then(response=>{
        deleteTasks(listId)
        res.send(response)
    })
    .catch(err=>{
        console.log('Doslo je do greske ' + err);
    })
})

// vracanje svih zadataka koji pripadaju naznacenoj listi
listRouter.get('/:listId/tasks',(req,res)=>{
    Task.find({
        _listId:req.params.listId
    })
    .then(result=>{
        res.send(result);
    })
    .catch(err=>{
        res.send('Doslo je do greske: ' + err);
    })
})

// dodavanje novog zadatka
listRouter.post('/:listId/tasks',(req,res)=>{
    const title = req.body.title;
    let newTask = new Task({
        title,
        _listId:req.params.listId
    })
    newTask.save()
        .then((result)=>{
            res.send(result)
        })
        .catch(err=>{
            res.send('Doslo je do greske: ' , err);
        })
})

// izmena postojeceg zadatka
listRouter.patch('/:listId/tasks/:taskId',(req,res)=>{
    Task.findByIdAndUpdate(
        {
            _id: req.params.taskId,
            _listId: req.params.listId
        },
        {
            $set:req.body
        }
    )
    .then(result=>{
        res.send(result);
    })
    .catch(err=>{
        res.send('Doslo je do greske: ' ,err);
    })
        
})

// brisanje zadatka
listRouter.delete('/:listId/tasks/:taskId',(req,res)=>{
    Task.findByIdAndDelete(
        {
            _id: req.params.taskId,
            _listId: req.params.listId
        }
    )
    .then(result=>{
        res.send(result);
    })
    .catch(err=>{
        res.send('Doslo je do greske: ' + err);
    })
})

const deleteTasks = (_listId)=>{
    Task.deleteMany({
        _listId
    }).then(user=>{
        console.log('Deleted all tasks from list')
    })
}

module.exports = {listRouter};