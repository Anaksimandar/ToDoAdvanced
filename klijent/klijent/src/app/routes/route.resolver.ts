import { RouterModule, Routes } from "@angular/router";
import { ToDoViewComponent } from "../to-do-view/to-do-view.component";
import { NewListComponent } from "../new-list/new-list.component";
import { NgModule } from "@angular/core";
import { NewTaskComponent } from "../new-task/new-task.component";
import { LoginPageComponent } from "../login-page/login-page.component";
import { SignInComponent } from "../sign-in/sign-in.component";
import { EditTaskComponent } from "../pages/edit-task/edit-task.component";
import { EditListComponent } from "../pages/edit-list/edit-list.component";

const routes: Routes = [
  {path: '', component:ToDoViewComponent},
  {path:'new-list', component:NewListComponent},
  {path:'new-task', component:NewTaskComponent},
  {path:'login',component:LoginPageComponent},
  {path:'lists/:id',component:ToDoViewComponent},
  {path:'lists/:listId/new-task',component:NewTaskComponent},
  {path:'sign-in',component:SignInComponent},
  {path:'edit-task/:taskId',component:EditTaskComponent},
  {path:'edit-list/:listId',component:EditListComponent}
]


@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoute{}