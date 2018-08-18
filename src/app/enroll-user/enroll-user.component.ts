import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings, Post, PostContent} from '../forum';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../filter.pipe';


@Component({
  selector: 'app-enroll-user',
  templateUrl: './enroll-user.component.html',
  styleUrls: ['./enroll-user.component.css']
})
export class EnrollUserComponent implements OnInit {
	users : any;
	enrolled : any;
	term : any;
  courseId: string;
  

  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  	this.enforumDataService
  		.retrieveEnrolledUsers(this.courseId)
  		.subscribe(
  			(enrolledUserList) => {
  				this.enrolled = enrolledUserList[0].students
  			}
  		)
  }

  retrieveUserMatch() {
  	this.enforumDataService
  		.retrieveUserMatch(this.term)
  		.subscribe(
  			(userList) => {
  				this.users = userList
  			}
  		)
  }

  enrollUser(userId) {
  	const enrollIds = {
  		userId : userId,
      name : this.users[0].name,
      studentid : this.users[0].studentid,
  		courseId : this.courseId
  	}
      
     const result = this.enrolled.find(e => e.id === enrollIds.userId)

     if(result == null) {
        this.enforumDataService
          .enrollUser(enrollIds)
          .subscribe(
            (result) => {
              this.enrolled = this.enrolled.concat({id: userId, name: this.users[0].name, studentid: this.users[0].studentid})
            }
          )       
     }


  }

  unenrollUser(userId) {
  	const unenrollIds = {
  		userId : userId,
  		courseId : this.courseId
  	}

  	this.enforumDataService
  		.unenrollUser(unenrollIds)
  		.subscribe(
  			(result) => {
  				this.enrolled = this.enrolled.filter(enrolled => enrolled.id !== userId)
  			}
  		)
  }


}
