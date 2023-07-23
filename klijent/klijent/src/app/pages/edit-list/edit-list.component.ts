import { Component } from '@angular/core';
import { ActivatedRoute, Params, Route, Router, Routes } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent {
  public listTitle:string;
  public currentList:List;

  constructor(private route:ActivatedRoute, private listService:ListService, private router:Router){
  }

  editList(){
    this.listService.editList(this.currentList._id,this.listTitle).subscribe(
      res=>{
        console.log(res);
        this.router.navigate(['/lists',this.currentList._id]);
      }
    )
  }

  navigateHome(){}

  ngOnInit(){
    this.route.params.subscribe((params:Params)=>{
      if(params['listId']){
        this.listService.getListById(params['listId']).subscribe(
          res=>{
            this.currentList = res;
            this.listTitle = this.currentList.title;
            console.log(this.currentList);
            
          }
        )
      }
      
    })
  }
}
