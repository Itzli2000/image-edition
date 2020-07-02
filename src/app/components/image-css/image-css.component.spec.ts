import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCssComponent } from './image-css.component';

describe('ImageCssComponent', () => {
  let component: ImageCssComponent;
  let fixture: ComponentFixture<ImageCssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
