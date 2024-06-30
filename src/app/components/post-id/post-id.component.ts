import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../state/models/post';
import { ComponentStore } from '@ngrx/component-store';
import { PostId } from '../../state/models/post_id';
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

  public currentIndexVal: number = -1;
  public activePostId: number = -1;

  public $currentIndex: Subscription;
  public $activePostId: Subscription;

  public $displayProp: Observable<string>;
  public $displaVal: Observable<unknown>;

  public postProps: string[] = [];

  constructor(private __cStore: ComponentStore<PostId>, private store: Store) {
    this.__cStore.setState({
      activeIndex: -1,
      displayProp: '',
      displayVal: '',
    })

    this.$currentIndex = this.__cStore.select((state) => ({
      source: this,
      activeIndex: state.activeIndex,
    })).subscribe(val => this.currentIndexVal = val.activeIndex);



    this.$displayProp = this.__cStore.select((state) => { return state.displayProp })
    this.$displaVal = this.__cStore.select((state) => { return state.displayVal })

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
  }

  setValues = this.__cStore.updater(
    (_state, newState: PostId) => { return { ...newState } }
  )

  // called when component is initialised, and to reset post to default
  initialiseState() {
    this.postProps = Object.keys(this.post).map(key => key);
    let defaultIndex = this.postProps.findIndex((el) => el === 'title')
    this.setValues({
      activeIndex: defaultIndex,
      displayProp: this.postProps[defaultIndex],
      displayVal: this.post[this.postProps[defaultIndex] as keyof Post],
    })
  }

  ngOnInit(): void {
    this.initialiseState();
  }

  updateDisplayVals() {

    // action is dispatched when post is clicked on first time
    if (this.activePostId != this.post.id) {
      this.store.dispatch(PostActions.selectActivePost({ activePostId: this.post.id }))
    }

    // logic for cycling through the keys
    let updateIndex = (this.currentIndexVal < this.postProps.length - 1) ? this.currentIndexVal + 1 : 0;
    let updatedProp = this.postProps[updateIndex];
    let updatedVal = this.post[updatedProp as keyof Post];

    this.setValues({
      activeIndex: updateIndex,
      displayProp: updatedProp,
      displayVal: updatedVal
    })
  }

  ngOnDestroy(): void {
    this.$activePostId.unsubscribe();
    this.$currentIndex.unsubscribe();
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
