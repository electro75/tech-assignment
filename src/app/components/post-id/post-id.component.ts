import { Component, Input, OnDestroy, OnInit, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Post } from '../../state/models/post';
import { ComponentStore } from '@ngrx/component-store';
import { PostIdState } from '../../state/models/postIdState';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectActivePost } from '../../state/selectors/posts.selectors';
import { PostActions } from '../../state/actions/posts.actions';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-id.component.html',
  styleUrl: './post-id.component.scss',
  providers: [ComponentStore]
})
export class PostIdComponent implements OnInit, OnDestroy {

  @Input() post: Post;
  public activePostId: number = -1;
  public $activePostId: Subscription;

  public activeIndex: WritableSignal<number>;
  public displayValSignal: Signal<unknown>;
  public displayPropSignal: Signal<string>;
  public props = ['userId', 'id', 'title', 'body'];
  public postProps: string[] = [];

  constructor(private __cStore: ComponentStore<PostIdState>, private store: Store) {

    this.post = {
      id: -1,
      userId: -1,
      body: '',
      title: ''
    };

    this.$activePostId = this.store.select(selectActivePost).subscribe(activePostId => {
      this.activePostId = activePostId;
      if (this.post.id !== activePostId) {
        this.initialiseState();
      }
    })

    this.activeIndex = signal(0);
    this.displayPropSignal = computed(() => {
      return this.props[this.activeIndex()]
    }
    )
    this.displayValSignal = computed(() => this.post[this.props[this.activeIndex()]])
  }

  setValues = this.__cStore.updater(
    (_state, newState: PostIdState) => { return { ...newState } }
  )

  initialiseState() {
    this.activeIndex = signal(this.postProps.findIndex((el) => el === 'title'))
    this.displayPropSignal = computed(() => {
      return this.props[this.activeIndex()]
    }
    )
    this.displayValSignal = computed(() => this.post[this.props[this.activeIndex()]])
  }

  ngOnInit(): void {
    this.postProps = Object.keys(this.post).map(key => key);
    this.initialiseState();
  }

  updateDisplayVals() {

    if (this.activePostId != this.post.id) {
      this.store.dispatch(PostActions.selectActivePost({ activePostId: this.post.id }))
    }

    let currentActiveIndexVal = this.activeIndex()

    this.activeIndex = signal(currentActiveIndexVal < this.props.length - 1 ? currentActiveIndexVal + 1 : 0);
    this.displayPropSignal = computed(() => {
      return this.props[this.activeIndex()]
    }
    )
    this.displayValSignal = computed(() => this.post[this.props[this.activeIndex()]])
  }

  ngOnDestroy(): void {
  }

  // naive approach - causes too many renders. App will get laggy for larger datasets
  // public activePropIdx: number = 0;
  // getDisplayProp() {
  //   return this.post[post_props[this.activePropIdx] as keyof Post]
  // }

  // getActiveProp() {
  //   return post_props[this.activePropIdx]
  // }

  // updateDisplayProp() {
  //   this.activePropIdx = (this.activePropIdx < post_props.length - 1) ? this.activePropIdx + 1 : 0;
  // }
}
