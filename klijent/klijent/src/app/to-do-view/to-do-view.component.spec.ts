import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoViewComponent } from './to-do-view.component';

describe('ToDoViewComponent', () => {
  let component: ToDoViewComponent;
  let fixture: ComponentFixture<ToDoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToDoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
