import { Injectable } from '@angular/core';
import { WebClientService } from './web-client.service';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private uri:string = 'tasks';
  constructor(private webClient:WebClientService) { 
  }

  createNewTask(title:string, listId:string):Observable<any>{
    return this.webClient.post(`lists/${listId}/${this.uri}`,{title});
    
  }

  getTasksByListId(listId:string):Observable<any>{
    return this.webClient.get(`lists/${listId}/${this.uri}`);
  }

  complete(task:Task):Observable<any>{
    return this.webClient.patch(`lists/${task.listId}/tasks/${task._id}`,{completed:!task.completed})
  }
}
