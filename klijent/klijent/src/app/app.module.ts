import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToDoViewComponent } from './to-do-view/to-do-view.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NewListComponent } from './new-list/new-list.component';
import { AppRoute } from './routes/route.resolver';
import { FormsModule } from '@angular/forms';
import { NewTaskComponent } from './new-task/new-task.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WebReqInterceptorService } from './web-req-interceptor.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { ModalComponent } from './pages/help-component/modal/modal.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
@NgModule({
  declarations: [
    AppComponent,
    ToDoViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginPageComponent,
    SignInComponent,
    EditTaskComponent,
    ModalComponent,
    EditListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoute,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:WebReqInterceptorService, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
