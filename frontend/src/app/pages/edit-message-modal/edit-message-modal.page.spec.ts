import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMessageModalPage } from './edit-message-modal.page';

describe('EditMessageModalPage', () => {
  let component: EditMessageModalPage;
  let fixture: ComponentFixture<EditMessageModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMessageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
