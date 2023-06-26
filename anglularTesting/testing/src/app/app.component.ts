import { Component } from '@angular/core';
import { WebserviceService } from './webservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts:any;
  constructor(private webService:WebserviceService){}

  getPosts(){
    this.webService.getPost().subscribe(posts=>{
      this.posts = posts;
      console.log(posts);
      
      
    })
  }
}
