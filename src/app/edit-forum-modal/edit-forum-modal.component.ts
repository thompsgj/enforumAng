
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings} from '../forum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-forum-modal',
  templateUrl: './edit-forum-modal.component.html',
  styleUrls: ['./edit-forum-modal.component.css']
})


export class EditForumModalComponent {
  firstFormGroup: FormGroup;

  checked : boolean = true;
  //reflection : bool;
  //checklist : bool;

  modalReference : NgbModalRef;

  courseId : string;
  forumId : string;
 
  forums: Forum[] = [];
  //newForum: Forum = new Forum();

  settings: Settings = {
    forumid: '',
    courseId: '',
    name: '',
    description: '',
    gradingMethod: 0,
    points: 0,
    checklist: false,
    reflection: false,
    goals: false,
    criterias: [],
    reflectionTasks: []
  };

  secondFormGroup: FormGroup;
  //criteriaList: any[] = [];
  //criteria: ''

  checklistData : any[] = [];
  controlVal : any[] = [];
  finalChecklistArr: any[] = [];

  thirdFormGroup: FormGroup;
  
  questionData : any[] = [];
  questionControlVal : any[] = [];
  finalQuestionArr: any[] = [];

  //questionList: any[] = [];
  question: ''
  autoResponse: ''
 // criteria: any[] = [];
 criteria: ''

  constructor(
    private _formBuilder: FormBuilder,
    private enforumDataService: EnforumDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      gradingMethod: '',
      points: ['', Validators.required],
      checklist: [''],
      reflection: [''],
      goals: [''],
      reflectionTasks: [],
      criterias: []
    });

    this.courseId = this.courseId;

    this.thirdFormGroup = this._formBuilder.group({
      questionList: this._formBuilder.array([
        this.initQuestion()
      ])
    });

    this.enforumDataService
      .retrievePosts(this.forumId)
      .subscribe(
        (Settings) => {
          this.settings = Settings[0].settings
          this.firstFormGroup.get('name').setValue(Settings[0].settings.name)
          this.firstFormGroup.get('description').setValue(Settings[0].settings.description)
          this.firstFormGroup.get('gradingMethod').setValue(Settings[0].settings.gradingMethod)
          this.firstFormGroup.get('points').setValue(Settings[0].settings.points)
          this.firstFormGroup.get('checklist').setValue(Settings[0].settings.checklist)
          this.firstFormGroup.get('reflection').setValue(Settings[0].settings.reflection)
          this.firstFormGroup.get('goals').setValue(Settings[0].settings.goals)

          this.checklistData = Settings[0].settings.criterias
          this.questionData = Settings[0].settings.reflectionTasks

 
          //Push data into a new array - Checklist
          for( var j : number = 0; j < this.checklistData.length; j++) {
            //this.finalChecklistArr.push(this.data[j].criteria)

            //Value: {criteria : "value"}
            //This one works correctly
            this.finalChecklistArr.push(this.checklistData[j].criteria)
          }

          //Push form controls into the FormArray using checklist array length
          for( var i : number = this.checklistData.length; i > 0; i--) {
            this.controlVal.push(new FormControl)
            //this.controlVal.push(this.initCriteria(this.finalChecklistArr[i]))
          }

          //Instantiate the FormArray - Checklist
          this.secondFormGroup = new FormGroup({
            criteriaList: new FormArray(
              this.controlVal
            )
          })

          //Patch the Checklist FormArray with the formatted data
          this.secondFormGroup.get('criteriaList').patchValue(this.finalChecklistArr)


          //Push dta into a new array - Question
          for (var j : number = 0; j < this.questionData.length; j++) {

            this.finalQuestionArr.push(this.questionData[j].question)
          }

          //Push form controls into FormArray
          for(var i : number =  this.questionData.length; i > 0; i--) {
            this.questionControlVal.push(new FormControl)
          }

          //Instantiate the FormArray - Question
          this.thirdFormGroup = new FormGroup({
            questionList: new FormArray(
              this.questionControlVal
            )
          })

          this.thirdFormGroup.get('questionList').patchValue(this.finalQuestionArr)
        }
      )

  }

  get criteriaList(): FormArray { return this.secondFormGroup.get('criteriaList') as FormArray}
  get questionList(): FormArray { return this.thirdFormGroup.get('questionList') as FormArray}

  get name() {
    return this.firstFormGroup.get('name');
  }
  get description() {
    return this.firstFormGroup.get('description');
  }
  get points() {
    return this.firstFormGroup.get('points');
  }
  get checklist() {
    return this.firstFormGroup.get('checklist');
  }
  get reflection() {
    return this.firstFormGroup.get('reflection');
  }
 
 
   clearCriteria() {
     //this.secondFormGroup.controls.criteriaList.controls = []
     //https://stackoverflow.com/questions/41950360/angular2-property-controls-does-not-exist-on-type-abstractcontrol-error-wh
     this.secondFormGroup.controls.criteriaList['controls'] = []
   }

   clearReflection() {
     //this.thirdFormGroup.controls.questionList.controls = []
     this.thirdFormGroup.controls.questionList['controls'] = []
   }

    initCriteria(): FormGroup {
      return this._formBuilder.group({
        criteria: ''
      });
    }

    initQuestion(): FormGroup {
      return this._formBuilder.group({
        question: '',
        autoResponse: ''
      })
    }


    addCriteria() {
      this.criteriaList.push(new FormControl());
    }

    removeCriteria(index: number) {
      const control = <FormArray>this.secondFormGroup.controls['criteriaList']
      control.removeAt(index);
    }


    addQuestion() {
      console.log("ADD QUESTION FUNCTION FIRED")
      /*OLD
      const control = <FormArray>this.thirdFormGroup.controls['questionList'];
      control.push(this.initQuestion());
      */

      this.questionList.push(new FormControl());
    }

    removeQuestion(index: number) {
      const control = <FormArray>this.thirdFormGroup.controls['questionList']
      control.removeAt(index);
    }


  @Output()
  add: EventEmitter<Forum> = new EventEmitter();



  editForum() {    
    this.settings.forumid = this.forumId

    function toObject(arr, type) {
      let reArr = [];
      for(let k: number = 0; k < arr.length; k++) {
        if(type === "checklist") {
          reArr.push({criteria: arr[k]})
        }  else {
           reArr.push({question: arr[k]})
        }
        
      }
      return reArr
    }

    this.settings.name = this.firstFormGroup.value.name
    this.settings.description = this.firstFormGroup.value.description
    this.settings.points = this.firstFormGroup.value.points
    this.settings.checklist = this.firstFormGroup.value.checklist
    this.settings.reflection = this.firstFormGroup.value.reflection
    this.settings.courseId = this.courseId   
    this.settings.criterias = toObject(this.secondFormGroup.value.criteriaList, "checklist")
    this.settings.reflectionTasks = toObject(this.thirdFormGroup.value.questionList,"question")
    this.settings.goals = this.firstFormGroup.value.goals
    
    this.enforumDataService
      .editForum(this.settings)
      .subscribe(
        (newForum) => {
          this.activeModal.close(this.settings)
        }
      )

  }


  resetSection() {
    this.secondFormGroup.reset()
  }

}
