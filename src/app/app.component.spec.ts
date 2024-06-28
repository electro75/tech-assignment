import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectPosts, selectActivePost } from './state/selectors/posts.selectors';
import { NetworkService } from './services/network.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';


describe('AppComponent', () => {

  let store: MockStore;
  const initialState = { posts: [], activePost: -1 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideMockStore({ initialState }), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectPosts, []);
    store.overrideSelector(selectActivePost, -1);
  });

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     imports: [AppComponent],
  //   }).compileComponents();
  // });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'tech-assignment' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tech-assignment');
  });
});
