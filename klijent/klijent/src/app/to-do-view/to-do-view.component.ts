import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from '../services/task.service';
import { List } from '../models/list.model';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-to-do-view',
  templateUrl: './to-do-view.component.html',
  styleUrls: ['./to-do-view.component.css']
})
export class ToDoViewComponent {
  public lists:List[] | undefined = [];
  public tasks:Task[] | undefined = [];
  constructor(private taskService:TaskService,private listService:ListService,private route: ActivatedRoute){
    listService.getAllLists().subscribe(result=>{
      this.lists = result;
    });
    
    
    
  }
  // On init se poziva kada Angular zavrsi sa kreiranjem komponente
  
  ngOnInit(){
      this.route.params.subscribe((params:Params)=>{
        if(params['id']){
          this.taskService.getTasksByListId(params['id']).subscribe((tasks:any)=>{
            this.tasks = tasks;
          })
        }
        else{
          this.tasks = undefined;
        }
        
        
        
        
      })
      
  }

  toggleComplete(task:Task){
    this.taskService.complete(task).subscribe(result=>{
      console.log(result);
      task.completed = !task.completed;
    })
  }
}


