
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings} from '../forum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-forum-modal',
  templateUrl: './create-forum-modal.component.html',
  styleUrls: ['./create-forum-modal.component.css']
})


export class CreateForumModalComponent {
  firstFormGroup: FormGroup;

  checked : boolean = true;
 // reflection : bool = false;
  //checklist : bool = false;

  modalReference : NgbModalRef;

  courseId : string;

   settings: Settings = {
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
  criteriaList: any[] = [];
  criteria: ''

  thirdFormGroup: FormGroup;
  questionList: any[] = [];
  question: ''
  autoResponse: ''
 // criteria: any[] = [];

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
      points: ['', Validators.required],
      checklist: [''],
      reflection: [''],
      goals: ['']
    });
    /*
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    */

    this.courseId = this.courseId;

    this.secondFormGroup = this._formBuilder.group({
      criteriaList: this._formBuilder.array([
      ])
    })

    this.thirdFormGroup = this._formBuilder.group({
      questionList: this._formBuilder.array([
    //    this.initQuestion()
      ])
    });

  }

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
      const control = <FormArray>this.secondFormGroup.controls['criteriaList'];
      control.push(this.initCriteria());
    }

    removeCriteria(index: number) {
      const control = <FormArray>this.secondFormGroup.controls['criteriaList']
      control.removeAt(index);
    }

    addQuestion() {
      const control = <FormArray>this.thirdFormGroup.controls['questionList'];
      control.push(this.initQuestion());
    }

    removeQuestion(index: number) {
      const control = <FormArray>this.thirdFormGroup.controls['questionList']
      control.removeAt(index);
    }



  forums: Forum[] = [];
  //newForum: Forum = new Forum();

  @Output()
  add: EventEmitter<Forum> = new EventEmitter();

  createForum(forum) {
    this.settings.name = this.firstFormGroup.value.name
    this.settings.description = this.firstFormGroup.value.description
    this.settings.points = this.firstFormGroup.value.points
    this.settings.checklist = this.firstFormGroup.value.checklist
    this.settings.reflection = this.firstFormGroup.value.reflection
    this.settings.goals = this.firstFormGroup.value.goals
    this.settings.courseId = this.courseId
    this.settings.criterias = this.secondFormGroup.value.criteriaList
    this.settings.reflectionTasks = this.thirdFormGroup.value.questionList

    this.enforumDataService
      .createForum(this.settings)
      .subscribe(
        (newForum) => {
          this.forums = this.forums.concat(newForum);
          this.activeModal.close(this.forums);
        }
      );

  }


  resetSection() {
    this.secondFormGroup.reset()
  }

}
