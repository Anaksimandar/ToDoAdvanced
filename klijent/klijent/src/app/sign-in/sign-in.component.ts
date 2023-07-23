import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebClientService } from '../services/web-client.service';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  form:FormGroup;

  constructor(formBuilder:FormBuilder,private webClient:WebClientService){
    this.form = formBuilder.group({
      "email":['',[Validators.required,Validators.email]],
      "password":['',[Validators.required,Validators.minLength(8)]]
    })
  }

  restartForm(){
    this.form.reset();
  }

  onSignInButtonClick(){
    if(!this.form.valid){
      window.alert('Form is not valid !');
    }
    else{
      this.webClient.signIn(this.form.get("email")?.value,this.form.get("password").value).subscribe((res:HttpResponse<any>)=>{
        console.log(res);
        
      })
    }
    this.restartForm();
    
  }
}
