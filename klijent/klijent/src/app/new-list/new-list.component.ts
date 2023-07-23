import { Component } from '@angular/core';
import { ListService } from '../services/list.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css']
})
export class NewListComponent {
  public newList:string;
  constructor(private listService:ListService, private router:Router){
    this.newList = '';
  }

  addNewList():void{
    if(this.newList.length > 1){
      this.listService.createNewList(this.newList).subscribe(result=>{
        alert('New List ' + this.newList + ' is succesfully created');
        this.newList = '';
        this.router.navigate(['/lists',result._id])
      })
      
    }
    else{
      alert('Title has to have atleast 2 letters.')
    }

  }
}
