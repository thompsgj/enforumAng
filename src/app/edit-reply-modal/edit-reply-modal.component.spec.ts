import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReplyModalComponent } from './edit-reply-modal.component';

describe('EditReplyModalComponent', () => {
  let component: EditReplyModalComponent;
  let fixture: ComponentFixture<EditReplyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReplyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
