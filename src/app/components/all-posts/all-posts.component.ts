import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { Store } from '@ngrx/store';
import { PostApiActions } from '../../state/actions/posts.actions';
import { Post } from '../../state/models/post';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
  providers: [NetworkService]
})
export class AllPostsComponent implements OnInit {

  constructor(private __network: NetworkService, private store: Store) { }

  ngOnInit() {
    this.__network
      .getAllPosts()
      .subscribe((posts) => {
        this.store.dispatch(PostApiActions.retrievedPostList({ posts }))
      })
  }
}
