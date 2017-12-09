import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideControlsComponent } from './side-controls.component';

describe('SideControlsComponent', () => {
  let component: SideControlsComponent;
  let fixture: ComponentFixture<SideControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
