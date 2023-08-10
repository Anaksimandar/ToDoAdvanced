import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  public currentListId:string;
  public taskIsLoading:boolean = true;
  public listIsLoading:boolean = true;
  constructor(private taskService:TaskService,private listService:ListService,private route: ActivatedRoute, private router:Router){
    listService.getAllLists().subscribe(result=>{
      this.lists = result;
      this.listIsLoading = false;
    });
  }
  // On init se poziva kada Angular zavrsi sa kreiranjem komponente
  
  ngOnInit(){
      this.route.params.subscribe((params:Params)=>{
        if(params['id']){
          this.taskService.getTasksByListId(params['id']).subscribe((tasks:any)=>{
            this.currentListId = params['id'];
            this.tasks = tasks;
            this.taskIsLoading = false;
          })
        }
        else{
          this.tasks = undefined;
        } 
      })
      
  }

  

  toggleComplete(task:Task){
    task.completed = !task.completed;
    this.taskService.complete(task).subscribe(result=>{ 
    })
  }

  deleteTask(task:Task){
    this.taskService.deleteTask(task).subscribe(result=>{
      this.tasks = this.tasks?.filter(task=>task._id !== result._id);
      this.router.navigate(['/'])
    }
    )
  }

  deleteList(){
    if(!this.currentListId){
      return alert("You must select a List");
    }
    this.listService.deleteList(this.currentListId).subscribe(
      res=>{
        console.log('result',res);
        
        this.lists = this.lists?.filter(l=>l._id !== res._id);
        this.tasks = this.tasks?.filter(t=>t._listId !== res._id);
        this.router.navigate(['/'])
        // kada dodje do brisanja liste, u search baru nam ostaje id obrisane liste
        // ne zelimo da ga ostavimo jer pri get zahtevu api trazi listu sa unetim id-em 
        // ali posto prijavljeni korisnik ne sme da ima pristup toj listi automatski se odjavljuje
        // sto moze delovati lose za korisnicko iskustvo

        
      }
    )
  }

  public openModal(){

  }
}


