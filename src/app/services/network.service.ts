import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, throwError } from 'rxjs';
import { Post } from '../state/models/post';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) { }

  public getAllPosts() {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').pipe(map((posts: Post[]) => posts))
  }
}
