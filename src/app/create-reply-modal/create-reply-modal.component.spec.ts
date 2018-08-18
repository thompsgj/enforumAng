import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReplyModalComponent } from './create-reply-modal.component';

describe('CreateReplyModalComponent', () => {
  let component: CreateReplyModalComponent;
  let fixture: ComponentFixture<CreateReplyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReplyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
