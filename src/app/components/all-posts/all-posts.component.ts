import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { Store } from '@ngrx/store';
import { PostApiActions } from '../../state/actions/posts.actions';
import { Post } from '../../state/models/post';
import { selectPosts } from '../../state/selectors/posts.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
  providers: [NetworkService]
})
export class AllPostsComponent implements OnInit {

  constructor(private __network: NetworkService, private store: Store) { }

  $posts = this.store.select(selectPosts);

  ngOnInit() {
    this.__network
      .getAllPosts()
      .subscribe((posts) => {
        this.store.dispatch(PostApiActions.retrievedPostList({ posts }))
      })
  }
}
