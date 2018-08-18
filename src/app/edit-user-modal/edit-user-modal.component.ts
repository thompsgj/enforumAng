import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent {


  userId : string;

  filteredOptions: Observable<string[]>
  myControl = new FormControl()
  userList: any = [];

 credentials = {
    id: '',
    email: '',
    name: '',
    password: '',
    role: '',
    studentid: ''
  };

  userForm: FormGroup;
  selectForm: FormGroup;
  userCtrl = new FormControl();
  
  constructor(
    private _formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private enforumDataService: EnforumDataService,
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.selectForm = this._formBuilder.group({
      user: [new FormControl(), [Validators.required]]
    })
    
    this.userForm = this._formBuilder.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: [''],
      role: ['', [Validators.required]],
      studentid: ['',[Validators.required]]
    })





    this.enforumDataService
    	.retrieveUsers()
    	.subscribe(
    		(result) => {
          this.userList = result
/*
          this.filteredOptions = this.myControl.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            )
*/
    		}
    	)

  }

/*  
  private _filter(value:string): string[] {
    console.log("FILTER WORKING", value)
    const filterValue = value.toLowerCase();

    return this.userList.filter(user => user.name.toLowerCase().includes(filterValue));
  }  
*/
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

  displayFn(user) {
    return user.name
  }

  register() {
  this.userForm.get('id').setValue(this.selectForm.value.user._id)
  this.userForm.get('name').setValue(this.selectForm.value.user.name)
  this.userForm.get('email').setValue(this.selectForm.value.user.email)
  this.userForm.get('role').setValue(this.selectForm.value.user.role)
  this.userForm.get('studentid').setValue(this.selectForm.value.user.studentid)
/*
    this.enforumDataService
      .registerUser(this.userForm.value)
      .subscribe(
        (result) => {
          console.log("Finished registering user", result)
          let msg="User added"
          this.activeModal.close(msg);
        }
      )
*/      
  }

  updateUser() {

    this.credentials.id = this.userForm.value.id
    this.credentials.name = this.userForm.value.name
    this.credentials.email = this.userForm.value.email
    this.credentials.password = this.userForm.value.password
    this.credentials.role = this.userForm.value.role
    this.credentials.studentid = this.userForm.value.studentid


    this.auth
      .updateUser(this.credentials)
      .subscribe(
        (result) => {
          let msg = "User Account Updated"
          this.activeModal.close(msg);
        }
      )

  }


}
