import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Component, ViewEncapsulation, Input} from '@angular/core';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { EditPostModalComponent } from '../edit-post-modal/edit-post-modal.component';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import { Observable } from 'rxjs/Observable';
import { Id, UpdateUserDetails } from '../forum';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})


export class ThreadsComponent {

  userDetails : UpdateUserDetails = {
      role: '',
      userid: '',
      name: ''
  }
  isAdmin:boolean = false
  isAuthor:boolean = false


  id: string;
  posts: any;
  msg: string;
  
  constructor(
    private auth: AuthenticationService,
  	private modalService: NgbModal,
  	private enforumDataService: EnforumDataService,
  	private route: ActivatedRoute,
    public snackBar : MatSnackBar
  ) { 
  	route.params.subscribe(params => {this.id = params['id'];})
  }

  public ngOnInit() { 	
    this.auth.profile().subscribe(user => {
      this.userDetails.userid = user._id
      this.userDetails.name = user.name
      this.userDetails.role = user.role

      this.toggleViewRole(this.userDetails.userid, this.userDetails.role)
    })

  	this.enforumDataService
  		.retrievePosts(this.id)
  		.subscribe(
  			(Post) => {
          this.posts = Post;

  			}
  		)
  }

  toggleViewRole(posterid, role) {
    if( this.userDetails.userid == posterid || this.userDetails.role == "admin") {
      return true
    }
  }


  createPost() {
	  const modalRef = this.modalService.open(CreatePostModalComponent);
	  modalRef.componentInstance.name = 'createPost';
	  modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.userid = this.userDetails.userid;
    modalRef.componentInstance.username = this.userDetails.name;
    modalRef.componentInstance.criterias = this.posts[0].settings.criterias;
    modalRef.componentInstance.reflectionTasks = this.posts[0].settings.reflectionTasks;
    modalRef.componentInstance.goals = this.posts[0].settings.goals
    modalRef.componentInstance.cId = this.posts[0].courseId
    
    modalRef.result.then((result) => {
      if (result == "Close click") {
        return false
      }
        this.posts[0].posts = this.posts[0].posts.concat(result[0].posts);
    })
  }

  editPost(postId) {
    const modalRef = this.modalService.open(EditPostModalComponent);
    modalRef.componentInstance.name = 'editPost';
    modalRef.componentInstance.id = postId
    modalRef.result.then((result) => {
      if(result == "Close click") {
        return false;
      }

      const updatedPost = result

      this.posts[0].posts = this.posts[0].posts.filter(post => post._id !== postId)

      this.posts[0].posts = this.posts[0].posts.concat(updatedPost) 

      this.msg = "This post has been updated!"
      this.snackBar.open(this.msg, "Close", {
        duration: 2000
      })
    })
  }

  deletePost(threadId) {
    if(confirm("Are you sure you want to delete?")) {

      let threadIdJSON = {
        id: threadId
      }

      this.enforumDataService
        .deletePost(threadIdJSON)
        .subscribe(
          (Thread) => {
            this.posts[0].posts = this.posts[0].posts.filter(post => post._id !== threadId)
          }
        )
    }
  }



}
