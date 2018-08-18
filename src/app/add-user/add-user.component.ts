import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    role: ''
  };

  userForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private enforumDataService: EnforumDataService,
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      studentid: ['', [Validators.required]]
    })
  }

  get email() {
    return this.userForm.get('email');
  }

  get name() {
    return this.userForm.get('name');
  }

  get password() {
    return this.userForm.get('password');
  }

  get role() {
    return this.userForm.get('role');
  }

  get studentid() {
    return this.userForm.get('studentid');
  }

  register() {

    this.enforumDataService
      .registerUser(this.userForm.value)
      .subscribe(
        (result) => {
          let msg="User added"
          this.activeModal.close(msg);
        }
      )
      
  }
}
