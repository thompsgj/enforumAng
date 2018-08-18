import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditForumModalComponent } from './edit-forum-modal.component';

describe('EditForumModalComponent', () => {
  let component: EditForumModalComponent;
  let fixture: ComponentFixture<EditForumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditForumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
