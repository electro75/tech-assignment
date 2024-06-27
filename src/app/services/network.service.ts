import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) { }

  public getAllPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts')
  }
}
