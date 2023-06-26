import { Injectable } from '@angular/core';
import { WebClientService } from './web-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private uri:string = 'lists';
  constructor(private webClient:WebClientService) { 

  }

  createNewList(title:string):Observable<any>{
    return this.webClient.post(this.uri,{title});
    
  }

  getAllLists():Observable<any>{
    return this.webClient.get(this.uri);
  }
}
