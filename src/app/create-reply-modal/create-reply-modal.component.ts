import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings, Post, PostContent, ReplyContent} from '../forum';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-reply-modal',
  templateUrl: './create-reply-modal.component.html',
  styleUrls: ['./create-reply-modal.component.css']
})


export class CreateReplyModalComponent {

  id :string;
  userid : string;
  username : string;

  firstFormGroup: FormGroup;

  forumId: string;
  userId: string;
  poster: string;
  modalReference: NgbModalRef;

  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.forumId = this.id
    this.userId = this.userid
    this.poster = this.username 

  }

  get title() {
    return this.firstFormGroup.get('title');
  }

  get content() {
    return this.firstFormGroup.get('content');
  }


  //replies = [];

  replyContent: ReplyContent = {
    id: '',
    userid: '',
    title: '',
    poster: '',
    content: ''    
  };

  createReply() {
     this.replyContent.id = this.forumId
     this.replyContent.poster = this.poster
     this.replyContent.userid = this.userid
     this.replyContent.title = this.firstFormGroup.value.title
     this.replyContent.content = this.firstFormGroup.value.content

     this.enforumDataService
       .createReply(this.replyContent)
       .subscribe(
         (newReply) => {
           this.activeModal.close(newReply);
         }
       )
  }
}

