const express = require('express');
const { authentication } = require('../controlers/user.auth.controler');
const listRouter = express.Router();
const {List} = require('../models/list.model');
const { Task, User } = require('../models');

//Method: GET /lists/task/:id
// Purpose: Returns task based on provided task id

listRouter.get('/task/:id',authentication,async (req,res)=>{
    const taskId = req.params.id;

    try{
        const task =  await Task.findById({_id:taskId});

        if(task){
            return res.send(task);
        }
        return res.status(401).send('Not found');
    }
    catch(err){
        console.log(err);
        return res.status(500).json(`Error fetching tasks ${err}`);
    }
   
})


// Method: GET /lists
// Purpose: returns all lists related to authenticated user
listRouter.get('/', authentication, async (req,res)=>{
    const userId = req.userId;
    try{
        const lists = await List.find({_userId:userId});
        return res.send(lists);
    }
    catch(err){
        res.status(500).send(err);
    }
    
        
})

// Method: GET /lists/:listId
// Purpose: gets specific list based on listId provided

listRouter.get('/:id',async(req,res)=>{
    const listId = req.params.id;
    try{
        const list = await List.findById({_id:listId});
        if(list){
            return res.send(list);
        }
        res.send(401).send('List doesnt exists');
    }
    catch(err){
        res.status(500).send('Server error' + err)
    }
})

// Method: POST /lists
// Purpose: adds list in account of authenticated user
listRouter.post('/',authentication,async (req,res)=>{
    const title = req.body.title;
    const userId = req.userId;
    console.log(userId);
    let newList = new List({
        title:title,
        _userId:userId
    })

    try{
        const savedList = await newList.save();
        return res.send(savedList);
    }
    catch(err){
        return res.status(500).send('List couldnt be saved' + err);
    }
})

// Method: PATCH /lists/:listId
// Purpose: updates list of authenticated user
listRouter.patch('/:id',authentication, async (req,res)=>{
    const userId = req.userId;
    
    try{
        const listExists = await List.findOneAndUpdate(
            {_id: req.params.id,_userId:userId},
            {$set:{title:req.body.title}},
            {new:true});
        
        if(listExists){
            return res.send(listExists);
        }
        return res.status(401).send('List doesnt exists');
    }
    catch(err){
        res.status(500).send('Server error'+err);
    }
})

// Method: DELETE /lists/:listId
// Purpose: Delete list of authenticated user
listRouter.delete('/:id', authentication, async (req,res)=>{
    const userId = req.userId;
    const listId = req.params.id;
    // ne zelimo da obrisemo samo listu vec i sve zadatke te liste
    
    try{
        const removeList = await List.findOneAndDelete({_id:listId,_userId:userId});
        if(removeList){
            console.log('removed list'+removeList);
            const [data,err] = await deleteTasks(listId);
            if(!err){
                return res.send(removeList)
            }
            return res.status(500).send(err);
            
        }
        return res.status.status(401).send(removeList);
    }
    catch(err){
        return res.status(500).send(err);
    }
})

// Method: GET /lists/:listId/tasks
// Purpose: Returns all tasks from list which belongs to authenticated user
listRouter.get('/:listId/tasks',authentication,(req,res)=>{
    const userId = req.userId;
    const listId = req.params.listId;
    // Checks is list belongs to authenticated user
    List.find({_id:listId, _userId:userId})
        .then(user=>{
            if(user.length > 0){
                return true;
            }
            return false;
    }).then(listHasUser=>{
        console.log(listHasUser);
        // if it does belong returns all tasks
        if(listHasUser){
            Task.find({
                _listId:listId
            })
            .then(result=>{
                res.send(result);
            })
            .catch(err=>{
                res.send('Doslo je do greske: ' + err);
            })
        }
        else{
            res.status(401).send('Current user doesnt have this list')
        }
    })
    .catch(err=>{
        res.status(403).send('You dont have permission to get provided list')
    })
    


    
})

// Method: POST /lists/:listId/tasks
// Purpose: Adds new task to authenticated user
listRouter.post('/:listId/tasks', authentication, (req,res)=>{
    const title = req.body.title;
    const listId = req.params.listId;
    const userId = req.userId;
    // Checking does provided list can be accessed by authenticated user
    List.find({_id:listId},{_userId:userId})
        .then(list=>{
            if(list.length > 0){
                return true;
            }
            return false;
        })
        .then(listHasUser=>{
            if(listHasUser){
                
                let newTask = new Task({
                    title:title,
                    _listId:listId
                })
                newTask.save()
                    .then((result)=>{
                        res.send(result)
                    })
                    .catch(err=>{
                        res.send('Doslo je do greske: ' , err);
                    })
            }
            else{
                res.status(401).send('This user doesnt have this list')
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(403).send('You dont have permission to access provided list.')
        })

    
})

// Method: PATCH /lists/:listId/tasks/:taskId
// Purpose: Updates provided task
listRouter.patch('/:listId/tasks/:taskId', authentication, async (req,res)=>{
    const userId = req.userId;
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const update = req.body; // {field:value}
    console.log(update);
    let listExists = false;
    // Checking does user have permission to access provided list and task

    try{
        const list = await List.find({_id:listId,_userId:userId});
        if(list.length > 0){
            listExists = true;
        }
        else{
            return res.status(401).send('List doesnt exists');
        }
    }
    catch(err){
        return res.send(err);
    }

    //list exists 
    try{
        const updatedTask= await Task.findByIdAndUpdate(taskId,{$set:update},{new:true});
        return res.json(updatedTask);
    }
    catch(err){
        return res.send(err);
    }

    // List.find({_id:listId,_userId:userId})
    //     .then(list=>{
    //         console.log(list);
    //         if(list.length>0){
    //             return true;
    //         }
    //         return false;
    //     })
    //     .then(listHasUser=>{
    //         console.log(listHasUser);
    //         if(listHasUser){
    //             Task.findOneAndUpdate({_id:taskId, _listId:listId},{$set:update},{new:true})
    //                 .then(result=>{
    //                     res.send(result);
    //                 })
    //                 .catch(err=>{
                        
    //                     res.send('Doslo je do greske: ' ,err);
    //                 })
    //         }
    //         else{
    //             res.status(401).send('This task cannot be changed')
    //         }
    //     })
    //     .catch(err=>{
    //         res.status(403).send('You dont have permission to change this task')
    //     })

    
        
})

// Method: DELETE /lists/:listId/tasks/:taskId
// Purpose: Delete provided task
listRouter.delete('/:listId/tasks/:taskId',authentication, async (req,res)=>{
    const userId = req.userId;
    const listId = req.params.listId;
    const taskId = req.params.taskId;

    let list;
    // checking does authenticated user has right to access provided list
    try{
        const existingList = await List.find({_id:listId,_userId:userId});
        if(existingList.length > 0){
            list = existingList;
        }
        
    }
    catch(err){
        return res.status(401).send('Task doesnt exists')
    }

    //list exists
    try{
        const task = await Task.findById({_id:taskId});
        if(task){
            const deletedTask = await Task.findByIdAndDelete({_id:taskId});
            return res.send(deletedTask);
        }  
        return res.status(401).send('Task doesnt exists')      
    }
    catch(err){
        return res.status(500).send(err);
        
    }
    
})

// Usage DELETE /lists/:listId
// Purpose: if user want to delete list it logical that all tasks, related to that list, 
// should be deleted.

const deleteTasks = async (_listId)=>{
    console.log('radi delete task');
    try{
        console.log('pokusava');
        const deletedCount = await Task.deleteMany({_listId});
        console.log('deleted'+deletedCount);
        return [deletedCount,null];
    }
    catch(err){
        console.log('greska');
        return [null,err];
        
    }
}

module.exports = {listRouter};