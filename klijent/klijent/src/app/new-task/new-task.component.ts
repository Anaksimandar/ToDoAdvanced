import { Component } from '@angular/core';
import { ListService } from '../services/list.service';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent {
  public newTask:string;
  private listId:string;

  constructor(private taskService:TaskService, private route:ActivatedRoute, private router:Router){
    this.newTask = '';
  }

  ngOnInit(){
    this.route.params.subscribe((param:Params)=>{
      this.listId = param['listId'];
      if(!this.listId){
        alert('Please choose the list in which you want to add new task.')
        this.router.navigate(['/']);
      }
    })
    
    
  }

  addNewTask():void{
    this.taskService.createNewTask(this.newTask,this.listId).subscribe(result=>{
      alert(`New task ${result.title} has been created`)
      this.newTask = '';
      this.router.navigate(['lists',result._listId]);
    })
  }
}
