import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { CreateReplyModalComponent } from '../create-reply-modal/create-reply-modal.component';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { EnforumDataService } from '../enforum-data.service';
import { EditReplyModalComponent } from '../edit-reply-modal/edit-reply-modal.component'
import { Observable } from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Id, Reply, UpdateUserDetails } from '../forum';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})


export class PostsComponent {

  userDetails : UpdateUserDetails= {
    userid: '',
    name: '',
    role: ''
  }

  isAdmin:boolean = false
  isTeacher:boolean = false
  isAuthor:boolean = false
  isStudent: boolean = false

  replies : any;
	id: string;
  multi: boolean = true

  msg: string;

  feedback = {
    id: '',
    comment: '',
    grade: ''
  }

  gradeOptions = [];

  feedbackForm : FormGroup;
  gradeForm: FormGroup;

  constructor(
    private auth: AuthenticationService,
    private _formBuilder: FormBuilder,
  	private modalService: NgbModal,
  	private enforumDataService: EnforumDataService,
  	private route: ActivatedRoute,
    public snackBar : MatSnackBar
  ) {
  	route.params.subscribe(params => {this.id = params['id']})
  }

  public ngOnInit() {
    this.feedbackForm = this._formBuilder.group({
      comment: ['', Validators.required],
      grade: ['']
    })


    this.auth.profile().subscribe(user => {
      this.userDetails = {
        userid: user._id,
        name: user.name,
        role: user.role
      }
      this.toggleRole(this.userDetails.role)

      this.enforumDataService
      .retrieveReplies(this.id)
      .subscribe(
        (replies) => {
          this.replies = replies;

          this.feedbackForm.get('comment').setValue(this.replies[0].posts[0].teacherFeedback)

          for(var i : number = 0; i < parseInt(this.replies[0].settings.points) + 1; i++) {
            this.gradeOptions.push(i)
          }
        }
      )
    })




  }

  toggleViewRole(posterid) {
    if( this.userDetails.userid == posterid) {
      return true
    }
  }


    toggleRole(role) {
    if(role === "admin") {
      this.isAdmin = true
      return this.isAdmin
    } else if (role === "teacher") {
      this.isTeacher = true
      return this.isTeacher
    } else {
      this.isStudent = true
      return this.isStudent
    }
  }

  get comment() {
    return this.feedbackForm.get('comment');
  }

  get grade() {
    return this.feedbackForm.get('grade');
  }

  createReply() {
	  const modalRef = this.modalService.open(CreateReplyModalComponent);
	  modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.userid = this.userDetails.userid;
    modalRef.componentInstance.username = this.userDetails.name;

    modalRef.result.then((result) => {
      if (result == "Close click") {
        return false;
      }


       //result._id = result.id

      this.replies[0].posts[0].replies = this.replies[0].posts[0].replies.concat(result);
    })
  }

  deleteReply(replyId) {
    if(confirm("Are you sure you want to delete?")) {

      let replyIdJSON = {
        id: replyId
      }

      this.enforumDataService
        .deleteReply(replyIdJSON)
        .subscribe(
          (Reply) => {
             this.replies[0].posts[0].replies = this.replies[0].posts[0].replies.filter(reply => reply._id !== replyId)
          }
        )
    }
  }

  editReply(replyId) {
    const modalRef = this.modalService.open(EditReplyModalComponent);
    modalRef.componentInstance.id = replyId;
    modalRef.result.then((result) => {
        if(result == "Close click") {
          return false;
        }
        const updatedReply = result

        this.replies[0].posts[0].replies = this.replies[0].posts[0].replies.filter(reply => reply._id !== replyId)

        this.replies[0].posts[0].replies = this.replies[0].posts[0].replies.concat(updatedReply)
     
        this.msg = "This reply has been updated!"
        this.snackBar.open(this.msg, "Close", {
          duration: 2000
        })
    })
  }

  feedbackResponse() {

    this.feedback.id = this.id
    this.feedback.comment = this.feedbackForm.value.comment
    this.feedback.grade = this.feedbackForm.value.grade
    this.enforumDataService
      .createTeacherFeedback(this.feedback)
      .subscribe(
        (Feedback) => {
          this.msg = "Your feedback has been saved!"
          this.snackBar.open(this.msg, "Close", {
            duration: 2000
          })
        }
      )

  }
}
