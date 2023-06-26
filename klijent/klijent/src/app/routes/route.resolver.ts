import { RouterModule, Routes } from "@angular/router";
import { ToDoViewComponent } from "../to-do-view/to-do-view.component";
import { NewListComponent } from "../new-list/new-list.component";
import { NgModule } from "@angular/core";
import { NewTaskComponent } from "../new-task/new-task.component";
import { LoginPageComponent } from "../login-page/login-page.component";

const routes: Routes = [
  {path: '', component:ToDoViewComponent},
  {path:'new-list', component:NewListComponent},
  {path:'login',component:LoginPageComponent},
  {path:'lists/:id',component:ToDoViewComponent},
  {path:'lists/:listId/new-task',component:NewTaskComponent}
]


@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoute{}