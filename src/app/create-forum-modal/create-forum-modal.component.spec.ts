import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForumModalComponent } from './create-forum-modal.component';

describe('CreateForumModalComponent', () => {
  let component: CreateForumModalComponent;
  let fixture: ComponentFixture<CreateForumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateForumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateForumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
