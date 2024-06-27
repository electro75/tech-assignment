import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { selectPosts, selectActivePost } from './state/selectors/posts.selectors';
import { Store } from '@ngrx/store';
import { AllPostsComponent } from './components/all-posts/all-posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AllPostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent implements OnInit {

  constructor(private store: Store) { }

  title = 'tech-assignment';

  posts$ = this.store.select(selectPosts);
  activePostId$ = this.store.select(selectActivePost)

  ngOnInit(): void {

  }
}
