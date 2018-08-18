import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings, Post, PostContent} from '../forum';
import { ActivatedRoute } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css']
})

export class CreatePostModalComponent {
  firstFormGroup: FormGroup;
  forumId: string;
  userId: string;
  poster: string;
  courseId: string;
  goalId: string;

  modalReference: NgbModalRef;

  checked: boolean = false

  secondFormGroup: FormGroup;
  criteriaValue: any[] = [];

  /*
  criteriaList: any[] = [];
  criteria: ''
  status: boolean
  val: boolean
  */

  thirdFormGroup: FormGroup;
  questionValue: any[] = [];
  // question: ''
/*
  questionList: any[] = [];
 
  autoResponse: 
*/
  posts: Post[] = [];

  postContent: PostContent = {
    id: '',
    title: '',
    poster: '',
    content: '',
    criterias: [],
    reflectionTasks: []
  };

  checklistEnabled: boolean = false
  reflectionTaskEnabled: boolean = false
  goalsEnabled: boolean = false
  priorGoals: boolean = false


  fourthFormGroup: FormGroup;
  goalValue: any[] = []
  goalList: any[] = []
  apiData;
  apiData2;
  apiData3;

  user

  form;

  id;
  userid;
  username;
  criterias;
  reflectionTasks;
  goals;
  cId;

  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {   
    //Retrieve Data Passed from Thread Page
    this.forumId = this.id    
    this.userId = this.userid
    this.poster = this.username
    this.criteriaValue = this.criterias
    this.questionValue = this.reflectionTasks
    this.goalsEnabled = this.goals
    this.courseId = this.cId
    this.user = this.auth.getUserDetails()

    //Disable Unnecessary Pages
    if(this.criteriaValue.length != 0) {
      this.checklistEnabled = true
      
    }
    
    if(this.questionValue.length != 0) {
      this.reflectionTaskEnabled = true
    }
    
    //Start Prior Goal Building
    if (this.goalsEnabled == true) {
      const data = {
        userId: this.user._id,
        forumId: this.forumId,
        courseId: this.courseId
      }

      this.enforumDataService
        .retrieveGoals(data)
        .subscribe(
        (goals) => {
          //this.posts = this.posts.concat(goals)
          if(goals.length == 0) {
            //Need to build in the capability for students to add their own criteria

            this.fourthFormGroup = this._formBuilder.group({
              priorGoalList: [],
              newGoalList: this._formBuilder.array([
              ])
            })

            return false
          } else {
            //Need to build in the capability to read students criteria
            this.priorGoals = true
            this.goalValue = goals[0].goals.goals
            this.goalId = goals[0].goals._id

            this.apiData3 = {
              priorGoalList: [],
            }

            for(let k : number = 0; k < this.goalValue.length; k++) {
              this.apiData3.priorGoalList.push({ goal: this.goalValue[k].goal, status: this.goalValue[k].status, id: k})
            }

            this.fourthFormGroup = this._formBuilder.group({
              priorGoalList: this.buildPriorGoalList(),
              newGoalList: this._formBuilder.array([
              ])
            })

            return goals
          }

        }
      )

    }
    //End Prior Goal List


    //Instantiate Form Structure
    this.apiData = {
      criteriaList: [],
    }
    this.apiData2 = {
      questionList: [],
    }


    //Push Checklist Data into Form Structure with Additional Keys
    for(let i : number = 0; i < this.criteriaValue.length; i++) {
      this.apiData.criteriaList.push({ criteria: this.criteriaValue[i].criteria, selected: false, id: i})
    }

    for(let j : number = 0; j < this.questionValue.length; j++) {
      this.apiData2.questionList.push({ question: this.questionValue[j].question, response: '', id: j})
    }

    //Add Checklist Data Array to the Proper Form
    this.secondFormGroup = this._formBuilder.group({
      criteriaList: this.buildCriteriaList()
    })

    this.thirdFormGroup = this._formBuilder.group({
      questionList: this.buildReflectionList()
    });

    this.firstFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

  }
//ngInit End





  initNewGoal(): FormGroup {
    return this._formBuilder.group({
      goal:'',
      status: false
    })
  }

  addGoal() {
    const control = <FormArray>this.fourthFormGroup.controls['newGoalList'];
    control.push(this.initNewGoal());    
  }

  removeGoal(index: number) {
    const control = <FormArray>this.fourthFormGroup.controls['newGoalList'];
    control.removeAt(index);
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

  get priorGoalList() {
    return this.fourthFormGroup.get('priorGoalList') as FormArray;
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

  buildPriorGoalList() {
    const arr = this.apiData3.priorGoalList.map(goal => {
      return this._formBuilder.control(goal.status)
    });
    return this._formBuilder.array(arr)
  }



  form1(){
  }

  form2(){
  }

  form3(){
  }

/*
  @Output()
  add: EventEmitter<Post> = new EventEmitter();
*/

  reformatChecklistSubmission(value) {    

    let formValue;
    //let formValue = [];

    if(value.length === 0) {
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

  reformatGoalSubmission(value) {
    const formValue = Object.assign({}, value, {
      priorGoalList: value.map((response, i) => {
        return {
          goal: this.apiData3.priorGoalList[i].goal,
          status: response
        }
      })      
    })
    return formValue.priorGoalList    
  }

  createPost() {

    this.postContent.id = this.forumId
    this.postContent.userid = this.userId
    this.postContent.poster = this.poster
    this.postContent.title = this.firstFormGroup.value.title
    this.postContent.content = this.firstFormGroup.value.content
    const checklist = this.reformatChecklistSubmission(this.secondFormGroup.get('criteriaList').value)
    this.postContent.criterias = checklist

    const reflection = this.reformatReflectionSubmission(this.thirdFormGroup.get('questionList').value)
    this.postContent.reflectionTasks = reflection

///////////////HANDLE PRIOR GOALS

    if(this.priorGoals == true) {
     let goalRemakePackage = {
       goalId: this.goalId,
       goals: this.reformatGoalSubmission(this.fourthFormGroup.get('priorGoalList').value)
     }

     this.enforumDataService
       .updateGoals(goalRemakePackage)
       .subscribe(
         (response) => {
         }
       )
    }

//////////////HANDLE NEW GOALS
    if (this.goalsEnabled == true) {
      this.goalList = this.fourthFormGroup.value.newGoalList
    }


    if(this.goalList.length != 0 ) {
      let goalPackage = {
       userId: this.user._id,
       forumId: this.forumId,
       courseId: this.courseId,
       goals: {
           goals: this.goalList
      }
    }

    this.enforumDataService
      .setGoals(goalPackage)
      .subscribe(
        (response) => {
        }
      )
    }


/////////////CREATE A NEW POST
    this.enforumDataService
      .createPost(this.postContent)
      .subscribe(
        (newPost) => {
          this.posts = this.posts.concat(newPost)
          this.activeModal.close(this.posts);
        }
      )

  }
}

