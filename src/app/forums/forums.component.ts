
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { EnforumDataService } from '../enforum-data.service';
import { CreateForumModalComponent } from '../create-forum-modal/create-forum-modal.component';
import { EditForumModalComponent } from '../edit-forum-modal/edit-forum-modal.component';
import { EnrollUserComponent } from '../enroll-user/enroll-user.component';
import { Observable } from 'rxjs/Observable';
import { Id } from '../forum';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./forums.component.css']
})

export class ForumsComponent {
  forums : any;
  msg: string;
  userDetails : UserDetails;
  id:any;
  title:any;

  isAdmin:boolean = false
  isTeacher:boolean = false
  isStudent:boolean = false

  constructor(
    private auth: AuthenticationService,
    private modalService: NgbModal,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    public snackBar : MatSnackBar
  ) {
    route.params.subscribe(params => {this.id = params['id']})
  }



//https://stackoverflow.com/questions/35992877/angular-2-best-practice-to-load-data-from-a-server-one-time-and-share-results-t
//https://stackoverflow.com/questions/35655361/angular2-how-to-load-data-before-rendering-the-component

  public ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user.role;

      this.toggleViewRole(this.userDetails)

    })

     this.enforumDataService
        .retrieveForums(this.id)
        .subscribe(
          (Forum) => {
            this.title = Forum[0].courseTitle
            this.forums = Forum; 
          }
        )


  }


  toggleViewRole(role) {
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

  enrollUser() {
    const modalRef = this.modalService.open(EnrollUserComponent);
    modalRef.componentInstance.courseId = this.id;

    modalRef.result.then((result) => {
      if (result == "Close click") {
        return false;
      }
      
      return true
    })
  }


  createForum() {
    const modalRef = this.modalService.open(CreateForumModalComponent);
    modalRef.componentInstance.courseId = this.id;
    //modalRef.componentInstance.name = 'ForumSettings';

    modalRef.result.then((result) => {
      if (result == "Close click") {
        return false;
      }
      this.forums = this.forums.concat(result);
    })
  }

  editForum(forumId) {
  	const modalRef = this.modalService.open(EditForumModalComponent);
  	modalRef.componentInstance.forumId = forumId;
    modalRef.result.then((result) => {
      if (result == "Close click") {
        return false;
      }
      const updatedForum = this.forums.filter(forum => forum._id == forumId)
      updatedForum[0].settings = result
      this.forums = this.forums.filter(forum => forum._id !== forumId)
      this.forums = this.forums.concat(updatedForum)

      this.msg ="The Forum has been updated."
      this.snackBar.open(this.msg, "Close", {
        duration: 2000
      })
    })

  }

  deleteForum(forumId) {
    if(confirm("Are you sure you want to delete?")) {

    let forumIdJSON = {
      id: forumId
    }
    
    this.enforumDataService
      .deleteForum(forumIdJSON)
      .subscribe(
        (Forum) => {
           this.forums = this.forums.filter(forum => forum._id !== forumId)
           //this.forums = this.forums.splice(index, 1)
        }
       )      
    }


  }


}

