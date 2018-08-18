
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { EnforumDataService } from '../enforum-data.service';
import {Forum, Settings} from '../forum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-forum-modal',
    template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="cities">
        <div *ngFor="let city of cities.controls; index as i">
          <input [formControlName]="i" placeholder="{{cities.values}}">
        </div>
      </div>
      <button>Submit</button>
    </form>
    
    <button (click)="addCity()">Add City</button>
    <button (click)="setPreset()">Set preset</button>
    <button (click)="fuckYou()">Fuck You</button>
  `,
  styleUrls: ['./edit-forum-modal.component.css']
})
export class EditForumModalComponent {
  form : FormGroup
  data : any[] = []
  controlVal : any[] = []

  ngOnInit() {

  this.data=  [
    'CH',
    'RIC',
    'BOS',
    'DAL'
  ]

  for(var i: number = this.data.length; i > 0; i--) {
    console.log("I value in FOR LOOP", i)
    this.controlVal.push(new FormControl)
  }

  this.form = new FormGroup({
    cities: new FormArray(
      this.controlVal
    ),
  });


    console.log("FORM", this.data.length)
    this.form.get('cities').patchValue(this.data)
  }

  
  get cities(): FormArray { return this.form.get('cities') as FormArray; }


  //this.cities.setValue(this.data)

  addCity() { this.cities.push(new FormControl()); }
 
  onSubmit() {
    console.log(this.cities.value);  // ['SF', 'NY']
    console.log(this.form.value);    // { cities: ['SF', 'NY'] }
  }
 
  setPreset() { this.cities.patchValue(['LA', 'MTV']); }

  fuckYou() {this.cities.patchValue(this.data)}
}
