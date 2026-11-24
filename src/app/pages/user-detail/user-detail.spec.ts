import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UserDetail } from './user-detail';
import { UserService } from '../../services/user-service';

describe('UserDetail', () => {
  let component: UserDetail;
  let fixture: ComponentFixture<UserDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetail],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { getUserById: () => of(undefined) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows "User not found" when the user does not exist', () => {
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('User not found');
  });
});
