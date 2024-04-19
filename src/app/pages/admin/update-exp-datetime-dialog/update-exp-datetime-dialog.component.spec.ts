import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpDatetimeDialogComponent } from './update-exp-datetime-dialog.component';

describe('UpdateExpDatetimeDialogComponent', () => {
  let component: UpdateExpDatetimeDialogComponent;
  let fixture: ComponentFixture<UpdateExpDatetimeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateExpDatetimeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateExpDatetimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
