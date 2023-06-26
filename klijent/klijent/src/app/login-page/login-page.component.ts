import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebClientService } from '../services/web-client.service';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  form: FormGroup;
  submited:boolean = false;

  constructor(private formBuilder:FormBuilder, private authService:AuthService){
    this.form = formBuilder.group({
      "email":['',[Validators.required,Validators.email]],
      "password":['',[Validators.required, Validators.minLength(8)]]
    })
  }
  onReset(){
    this.submited = false;
    this.form.reset();
  }
  onLoginButtonClick(){
    this.submited = true;
    if(!this.form.valid){
      window.alert('Form is not valid');
    }
    else{
      this.authService.login(this.form.get('email')?.value,this.form.get('password')?.value).subscribe((res:HttpResponse<any>)=>{
        console.log(res.headers.get("x-access-token"));
        
      })
    }
    this.onReset();
  }
}
