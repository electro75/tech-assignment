import { Component, OnDestroy, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { Store } from '@ngrx/store';
import { PostActions, PostApiActions } from '../../state/actions/posts.actions';
import { Post } from '../../state/models/post';
import { selectActivePost, selectPosts } from '../../state/selectors/posts.selectors';
import { CommonModule } from '@angular/common';
import { PostIdComponent } from '../post-id/post-id.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, PostIdComponent],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
  providers: [NetworkService]
})
export class AllPostsComponent implements OnInit, OnDestroy {

  public $activePostId: Subscription;
  public $posts: Subscription;

  public activePostId: number = -1;
  public loading: boolean = false;
  public fetchedPosts: Post[] = [];

  constructor(private __network: NetworkService, private store: Store) {

    // to display the current active post
    this.$activePostId = this.store.select(selectActivePost).subscribe(postId => {
      this.activePostId = postId;
    });

    // store in local variable to track loading/error states
    this.$posts = this.store.select(selectPosts).subscribe(posts => {
      this.fetchedPosts = [...posts];
    });
  }



  // fetch all posts on load and store them in global state
  ngOnInit() {
    this.loading = true;
    this.__network
      .getAllPosts()
      .subscribe((posts) => {
        this.loading = false
        this.store.dispatch(PostApiActions.retrievedPostList({ posts }))
      }, (e) => {
        console.log(e);
        this.loading = false;
      })
  }

  // resets app back to its default state
  resetActivePost() {
    this.store.dispatch(PostActions.selectActivePost({ activePostId: -1 }))
  }

  ngOnDestroy(): void {
    this.$posts.unsubscribe();
    this.$activePostId.unsubscribe();
  }
}
