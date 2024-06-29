import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NetworkService } from '../../services/network.service';
import { AllPostsComponent } from './all-posts.component';
import { PostApiActions } from '../../state/actions/posts.actions';
import { selectActivePost, selectPosts } from '../../state/selectors/posts.selectors';
import { of } from 'rxjs';
import { Post } from '../../state/models/post';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { PostIdComponent } from '../post-id/post-id.component';
import { provideHttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';

describe('AllPostsComponent', () => {
  let component: AllPostsComponent;
  let fixture: ComponentFixture<AllPostsComponent>;
  let store: MockStore;
  let networkService: jasmine.SpyObj<NetworkService>;
  const initialState = { posts: [], activePost: -1 };

  beforeEach(async () => {
    const networkServiceSpy = jasmine.createSpyObj('NetworkService', ['getAllPosts']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, AllPostsComponent, PostIdComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NetworkService, useValue: networkServiceSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    networkService = TestBed.inject(NetworkService) as jasmine.SpyObj<NetworkService>;
    fixture = TestBed.createComponent(AllPostsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default activePostId of -1', () => {
    const mockPostId = -1;
    store.overrideSelector(selectActivePost, mockPostId);
    store.refreshState()
    expect(component.activePostId).toBe(-1);
  });

  it('should select active post from store', () => {
    const mockPostId = -1;
    store.overrideSelector(selectActivePost, mockPostId);
    store.refreshState();
    fixture.detectChanges();

    expect(component.activePostId).toBe(mockPostId);
  });

  it('should fetch posts and store posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
      { id: 2, title: 'Post 2', body: 'Body 2', userId: 1 }
    ];
    networkService.getAllPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();
    store.overrideSelector(selectPosts, mockPosts);
    store.refreshState();
    store.select(selectPosts).subscribe(posts => {
      expect(posts.length).toBe(mockPosts.length);
    })
    const actions: Action[] = [];
    store.scannedActions$.subscribe(action => actions.push(action));
    expect(actions.length).toBeGreaterThan(0);
  });

  it('should get fetchedPosts from store', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' }
    ];

    component.ngOnInit();
    store.refreshState();
    fixture.detectChanges();

    expect(component.fetchedPosts.length).toBe(mockPosts.length);
  });
});
