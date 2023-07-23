import { Component } from '@angular/core';
import {Task} from '../../models/task.model'
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  public currentTask:Task;
  public taskTitle:string;

  constructor(private route:ActivatedRoute, private taskService:TaskService, private router:Router){
    
  }

  navigateHome(){
    if(this.currentTask){
      this.router.navigate(['/lists/',this.currentTask._listId]);
    }
    else{
      this.router.navigate(['/']);
    }
  }
  

  ngOnInit(){
    this.route.params.subscribe((params:Params)=>{
      console.log('Params:', params['taskId']);
      
      if(params['taskId']){
        // if api throws err opservable wont be executed and we wont have current task
        this.taskService.getTaskById(params['taskId']).subscribe(
          res=>{
            this.currentTask = res;
            this.taskTitle = res.title;
            console.log('Current task:', res);
          },
          err=>{
            console.log('Error:' , err);
            
          }
        )
      }
      else{
        alert('Bad params:'+ params['taskId']);
      }
      
    })
  }

  editTask(){
    if(this.currentTask){
      const update = {title:this.taskTitle};
      this.taskService.editTask(this.currentTask,update).subscribe((updatedTask:Task)=>{
        this.router.navigate(['/lists',updatedTask._listId]);
        
      })
    }
    else{
      this.router.navigate(['/']);
    }
    
  }
}
