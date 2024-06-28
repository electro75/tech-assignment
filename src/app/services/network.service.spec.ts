import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NetworkService } from './network.service';
import { Post } from '../state/models/post';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(NetworkService);
  })

  it('should fetch all posts', () => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const dummyPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
      { id: 2, title: 'Post 2', body: 'Body 2', userId: 2 }
    ];

    service.getAllPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpTesting.expectOne('https://jsonplaceholder.typicode.com/posts', 'Request to fetch posts');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts); // Respond with the dummy posts
    httpTesting.verify();
  })
});
