import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent {
user: any;
userId: string;
userid;

 credentials = {
    id: '',
    email: '',
    name: '',
    password: '',
    role: '',
    studentid: ''
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

  	//this.userId = this.userid

    this.userForm = this._formBuilder.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: [''],
      studentid: ['',[Validators.required]]
    })

    this.enforumDataService
    	.retrieveUser(this.userid)
    	.subscribe(
    		(userInfo) => {
          this.userForm.get('id').setValue(userInfo[0]._id)
    			this.userForm.get('email').setValue(userInfo[0].email)
    			this.userForm.get('name').setValue(userInfo[0].name)
    			this.userForm.get('password').setValue(userInfo[0].password)
          this.userForm.get('studentid').setValue(userInfo[0].studentid)
          this.credentials.role = userInfo[0].role
    		}
    	)
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

    this.credentials.id= this.userForm.value.id
    this.credentials.email= this.userForm.value.email
    this.credentials.name= this.userForm.value.name
    this.credentials.password= this.userForm.value.password
    this.credentials.studentid= this.userForm.value.studentid
    this.auth
      .updateSelf(this.credentials)
      .subscribe(
        (result) => {
          this.activeModal.close(result);
        }
      )
      
  }

}
