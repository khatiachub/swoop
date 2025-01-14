import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredItemsComponent } from './filtered-items.component';

describe('FilteredItemsComponent', () => {
  let component: FilteredItemsComponent;
  let fixture: ComponentFixture<FilteredItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilteredItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
