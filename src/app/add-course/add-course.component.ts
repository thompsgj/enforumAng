import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Course } from '../forum';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {

  course: Course = {
    title: '',
    description: '',
    instructor: '',
    students: []
  };

  instructorList : any[] = []

  courseForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
  	private enforumDataService: EnforumDataService,
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.courseForm = this._formBuilder.group({
      title: ['',[Validators.required]],
      description: ['',[Validators.required]],
      instructor: ['',[Validators.required]]
    })

    this.enforumDataService
      .retrieveInstructors()
      .subscribe(
        (result) => {
          this.instructorList = result
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


//On Init populate a list of teachers
//Serve the list of teachers in a teacher variable
//Value off select will be _id, visible will be name

  addCourse() {

  	this.enforumDataService
  		.addCourse(this.courseForm.value)
  		.subscribe(
  			(result) => {
          //this.router.navigateByUrl('/profile')
          this.activeModal.close(result);
  			}
  		)

  }

}
