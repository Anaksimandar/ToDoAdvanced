import { Injectable } from '@angular/core';
import { WebClientService } from './web-client.service';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { List } from '../models/list.model';



@Injectable({
  providedIn: 'root'
})
export class ListService {
  private uri:string = 'lists';
  constructor(private webClient:WebClientService) { 

  }

  getListById(listId:string):Observable<any>{
    return this.webClient.get(`${this.uri}/${listId}`);
  }

  createNewList(title:string):Observable<any>{
    return this.webClient.post(this.uri,{title});
    
  }

  getAllLists():Observable<any>{
    return this.webClient.get(this.uri);
  }

  editList(listId:string,listTitle:string):Observable<any>{
    return this.webClient.patch(`${this.uri}/${listId}`,{title:listTitle});
  }

  deleteList(listId:string):Observable<any>{
    return this.webClient.delete(`${this.uri}/${listId}`);
  }
}
