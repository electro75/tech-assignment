import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { AllPostsComponent } from './all-posts.component';
import { NetworkService } from '../../services/network.service';
import { PostApiActions, PostActions } from '../../state/actions/posts.actions';
import { selectPosts, selectActivePost } from '../../state/selectors/posts.selectors';
import { Post } from '../../state/models/post';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MockComponents } from 'ng-mocks';
import { PostIdComponent } from '../post-id/post-id.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AllPostsComponent', () => {
  let component: AllPostsComponent;
  let fixture: ComponentFixture<AllPostsComponent>;
  let networkService: jasmine.SpyObj<NetworkService>;
  let store: MockStore;
  let initialState: any;

  beforeEach(async () => {
    initialState = { posts: [], activePost: -1 };
    networkService = jasmine.createSpyObj('NetworkService', ['getAllPosts']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, AllPostsComponent, MockComponents(PostIdComponent)],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({ initialState }),
        { provide: NetworkService, useValue: networkService }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AllPostsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state initially', () => {
    fixture.detectChanges();
    expect(component.loading).toBeTrue();
    const loadingElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(loadingElement.textContent).toContain('Fetching Posts...');
  });

  it('should fetch posts and dispatch action', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' }
    ];
    networkService.getAllPosts.and.returnValue(of(mockPosts));
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(networkService.getAllPosts).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledWith(PostApiActions.retrievedPostList({ posts: mockPosts }));
  }));

  it('should handle error state correctly', fakeAsync(() => {
    networkService.getAllPosts.and.returnValue(throwError('Error'));
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.fetchedPosts.length).toBe(0);
    const errorElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(errorElement.textContent).toContain('Sorry having trouble fetching posts, please try again later');
  }));

  it('should display fetched posts', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' }
    ];
    store.overrideSelector(selectPosts, mockPosts);
    networkService.getAllPosts.and.returnValue(of(mockPosts));

    fixture.detectChanges();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const postElements = fixture.debugElement.queryAll(By.css('app-post-id'));
    expect(postElements.length).toBe(mockPosts.length);
  }));

  it('should reset active post when button is clicked', () => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(store.dispatch).toHaveBeenCalledWith(PostActions.selectActivePost({ activePostId: -1 }));
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.$posts, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.$posts.unsubscribe).toHaveBeenCalled();
  });
});
