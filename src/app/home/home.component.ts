import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  constructor(
    private _formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    }); 
  }
}
