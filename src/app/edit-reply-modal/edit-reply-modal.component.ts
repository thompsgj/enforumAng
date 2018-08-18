import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings} from '../forum';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-reply-modal',
  templateUrl: './edit-reply-modal.component.html',
  styleUrls: ['./edit-reply-modal.component.css']
})
export class EditReplyModalComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  modalReference: NgbModalRef;

  reply : any;

  replyId : any
  updatedReply = {
    _id: '',
    userid: '',
    poster: '',
    title: '',
    content: '',
    beginReply: '',
    sendReply: ''
  }

  id;
  
  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal 
  ) { }

  ngOnInit() {
    this.replyId = this.id
    
    this.firstFormGroup = this._formBuilder.group({
      _id: [''],
      userid: [''],
      poster: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      beginReply: [''],
      sendReply:['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.enforumDataService
      .retrieveReply(this.replyId)
      .subscribe(
        (reply) => {
          this.reply = reply;

          this.firstFormGroup.get('_id').setValue(reply[0]._id)
          this.firstFormGroup.get('userid').setValue(reply[0].userid)
          this.firstFormGroup.get('poster').setValue(reply[0].poster)
          this.firstFormGroup.get('title').setValue(reply[0].title)
          this.firstFormGroup.get('content').setValue(reply[0].content)
          this.firstFormGroup.get('beginReply').setValue(reply[0].beginReply)
          this.firstFormGroup.get('sendReply').setValue(reply[0].sendReply)
        }
      )

  }

  get _id() {
    return this.firstFormGroup.get('_id');
  }

  get userid() {
    return this.firstFormGroup.get('userid');
  }

  get poster() {
    return this.firstFormGroup.get('poster');
  }

  get title() {
    return this.firstFormGroup.get('title');
  }

  get content() {
    return this.firstFormGroup.get('content');
  }

  get beginReply() {
    return this.firstFormGroup.get('beginReply');
  }

  get sendReply() {
    return this.firstFormGroup.get('sendReply');
  }

  form1(){
  }

  form2(){
  }

  editReply() {

    this.updatedReply._id = this.replyId
    this.updatedReply.userid = this.firstFormGroup.value.userid
    this.updatedReply.poster = this.firstFormGroup.value.poster
    this.updatedReply.title = this.firstFormGroup.value.title
    this.updatedReply.content = this.firstFormGroup.value.content
    this.updatedReply.beginReply = this.firstFormGroup.value.beginReply
    this.updatedReply.sendReply = this.firstFormGroup.value.sendReply

    this.enforumDataService
      .editReply(this.updatedReply)
      .subscribe(
        (newReply) => {
          this.activeModal.close(this.updatedReply);
        }
      )
  }

  resetSection() {
    this.secondFormGroup.reset()
  }

}

