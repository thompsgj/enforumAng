import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    role: 'student'
  };

  registerForm: FormGroup;

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required]],
      role: ['student', [Validators.required]] 
    })
  }

  constructor(
    private _formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    public snackBar : MatSnackBar
  ) {}

  get email() {
    return this.registerForm.get('email');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get password() {
    return this.registerForm.get('password');
  }

  register() {
    this.auth.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });

  }
}
