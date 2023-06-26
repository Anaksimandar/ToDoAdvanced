const express = require('express');
const listRouter = express.Router();

// vracanje svih lista
listRouter.get('/',(req,res)=>{
    List.find({})
        .then(result=>{
            res.status(200).send(result);
        })
        .catch(err=>{
            res.status(404).send('Doslo je do greske: ' , err);
        })
})

//dodavanje nove liste
listRouter.post('/',(req,res)=>{
    let title = req.body.title;
    let newList = new List({
        title
    })
    newList.save()
        .then(response=>{
            res.send(response);
        })
})

//azuriranje vec postojece liste
listRouter.patch('/:id',(req,res)=>{
    List.findOneAndUpdate(
        {_id: req.params.id},
        {$set:{title:req.body.title}}
    )
    .then(response=>{
        res.send(response)
    })
    .catch(err=>{
        console.log('Doslo je do greske ' + err);
    })
})

//brisanje jedne liste
listRouter.delete('/:id',(req,res)=>{
    List.findByIdAndDelete(
        {_id: req.params.id}
    )
    .then(response=>{
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

module.exports = {listRouter};