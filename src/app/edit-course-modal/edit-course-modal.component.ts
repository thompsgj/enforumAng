import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.css']
})
export class EditCourseModalComponent {


  userId : string;

  filteredOptions: Observable<string[]>
  myControl = new FormControl()
  courseList: any[] = [];
  instructorList : any[] = [];

course = {
	id: '',
	title: '',
	description: '',
	instructor: ''
}

  courseForm: FormGroup;
  selectForm: FormGroup;
  courseCtrl = new FormControl();
  
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
      course: [new FormControl(), [Validators.required]]
    })
    
    this.courseForm = this._formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      instructor: ['', Validators.required]
    })

    this.enforumDataService
    	.retrieveCourseSelectionList()
    	.subscribe(
    		(result) => {
          this.courseList = result

    		}
    	)

  }


  get title() {
    return this.courseForm.get('title');
  }

  get description() {
    return this.courseForm.get('description');
  }

  get instructor() {
    return this.courseForm.get('instructor');
  }


  displayFn(user) {
    return user.title
  }

  select() {

    this.enforumDataService
      .retrieveInstructors()
      .subscribe(
        (result) => {
          this.instructorList = result

		  this.courseForm.get('id').setValue(this.selectForm.value.course._id)
		  this.courseForm.get('title').setValue(this.selectForm.value.course.title)
		  this.courseForm.get('description').setValue(this.selectForm.value.course.description)
		  this.courseForm.get('instructor').setValue(this.selectForm.value.course.instructor)

        }
      )

 }

  updateCourse() {

    this.course.id = this.courseForm.value.id
    this.course.title = this.courseForm.value.title
    this.course.description = this.courseForm.value.description
    this.course.instructor = this.courseForm.value.instructor

    this.enforumDataService
      .updateCourse(this.course)
      .subscribe(
        (result) => {
          let msg = "User Account Updated"
          this.activeModal.close(msg);
        }
      )

  }

}
