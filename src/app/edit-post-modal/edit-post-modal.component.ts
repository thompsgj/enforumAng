import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings, Post, PostContent} from '../forum';
import { ActivatedRoute } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox'

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.css']
})
export class EditPostModalComponent {

  id;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  criteriaValue: any[] = [];

  thirdFormGroup: FormGroup;
  questionValue: any[] = [];

  modalReference: NgbModalRef;

  postId : string
  post : any;

  
  postContent = {
    _id: '',
    userid: '',
    poster: '',
    title: '',
    content: '',
    beginPost: '',
    sendPost: '',
    wordCount: '',
    criterias: [],
    reflectionTasks: []
  };


  checklistEnabled: boolean = false
  reflectionTaskEnabled: boolean = false

  apiData;
  apiData2;

  form;

  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal    
  ) { }

  ngOnInit() {
    this.postId = this.id
    this.firstFormGroup = this._formBuilder.group({
      _id: [''],
      userid: [''],
      poster: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      beginPost: [''],
      sendPost: [''],
      wordCount: [''],
    });

    this.enforumDataService
      .retrievePost(this.postId)
      .subscribe(
        (Post) => {
          this.post = Post[0].posts[0];
          this.firstFormGroup.get('_id').setValue(this.post._id)
          this.firstFormGroup.get('userid').setValue(this.post.userid)
          this.firstFormGroup.get('poster').setValue(this.post.poster)
          this.firstFormGroup.get('title').setValue(this.post.title)
          this.firstFormGroup.get('content').setValue(this.post.content)
          this.firstFormGroup.get('beginPost').setValue(this.post.beginPost)
          this.firstFormGroup.get('sendPost').setValue(this.post.sendPost)
          this.firstFormGroup.get('wordCount').setValue(this.post.wordCount)

          //Disable Unnecessary Pages
          if(this.post.criterias.length != 0) {
            this.checklistEnabled = true
          }
          
          if(this.post.reflectionTasks.length != 0) {
            this.reflectionTaskEnabled = true
          }

          //Instantiate Form Structure
          this.apiData = {
            criteriaList: [],
          }
          this.apiData2 = {
            questionList: [],
          }

          //Push Checklist Data into Form Structure with Additional Keys
          for(let i : number = 0; i < this.post.criterias.length; i++) {
            this.apiData.criteriaList.push({ criteria: this.post.criterias[i].criteria, selected: this.post.criterias[i].selected, id: i})
          }

          for(let j : number = 0; j < this.post.reflectionTasks.length; j++) {
            this.apiData2.questionList.push({ question: this.post.reflectionTasks[j].question, response: this.post.reflectionTasks[j].response, id: j})
          }

          //Add Checklist Data Array to the Proper Form
          this.secondFormGroup = this._formBuilder.group({
            criteriaList: this.buildCriteriaList()
          })

          this.thirdFormGroup = this._formBuilder.group({
            questionList: this.buildReflectionList()
          });
        }
      )

  }

  get title() {
    return this.firstFormGroup.get('title');
  }

  get content() {
    return this.firstFormGroup.get('content');
  }

  //Get Form Instance as a FormArray Type
  get criteriaList() {
    return this.secondFormGroup.get('criteriaList') as FormArray;
  }

  get reflectionList() {
    return this.thirdFormGroup.get('questionList') as FormArray;
  }

  //Build the Form Controls and Map the Data
  buildCriteriaList() {
    const arr = this.apiData.criteriaList.map(criteria => {
      return this._formBuilder.control(criteria.selected);
    });
    return this._formBuilder.array(arr)
  }

  buildReflectionList() {
    const arr = this.apiData2.questionList.map(question => {
      return this._formBuilder.control(question.response);
    });
    return this._formBuilder.array(arr)
  }


  form1(){
  }

  form2(){
  }


  reformatChecklistSubmission(value) {
    
    let formValue;
    //let formValue = [];

    if(value.length === 0) {
      console.log("RETURN EARLY DUE TO 0 LENGTH")
      return formValue
    }
    
    formValue = Object.assign({}, value, {
      criteriaList: value.map((selected, i) => {
        return {
          criteria: this.apiData.criteriaList[i].criteria,
          selected: selected
        }
      })
    })
    return formValue.criteriaList
  }

  reformatReflectionSubmission(value) {
    const formValue = Object.assign({}, value, {
      questionList: value.map((response, i) => {
        return {
          question: this.apiData2.questionList[i].question,
          response: response
        }
      })      
    })
    return formValue.questionList
  }

  editPost() {
    this.postContent._id = this.postId
    this.postContent.userid = this.firstFormGroup.value.userid
    this.postContent.poster = this.firstFormGroup.value.poster
    this.postContent.title = this.firstFormGroup.value.title
    this.postContent.content = this.firstFormGroup.value.content
    this.postContent.beginPost = this.firstFormGroup.value.beginPost
    this.postContent.sendPost = this.firstFormGroup.value.sendPost
    this.postContent.wordCount = this.firstFormGroup.value.wordCount


    let checklist = this.reformatChecklistSubmission(this.secondFormGroup.get('criteriaList').value)
   // let results :any[] : []

    //results = checklist
    //  console.log("POST CONTENT UPDATED W/ CHECKLIST", results)
    this.postContent.criterias = checklist
  

    const reflection = this.reformatReflectionSubmission(this.thirdFormGroup.get('questionList').value)
    this.postContent.reflectionTasks = reflection

    this.enforumDataService
      .editPost(this.postContent)
      .subscribe(
        (newPost) => {
          this.activeModal.close(this.postContent)
        }
      )
  }

  resetSection() {
    this.secondFormGroup.reset()
  }
}
