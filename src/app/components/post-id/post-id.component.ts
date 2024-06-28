import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../state/models/post';
import { post_props } from '../../constants/constants';
import { ComponentStore } from '@ngrx/component-store';
import { PostId } from '../../state/models/post_id';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectActivePost } from '../../state/selectors/posts.selectors';
import { PostActions } from '../../state/actions/posts.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-id.component.html',
  styleUrl: './post-id.component.scss',
  providers: [ComponentStore]
})
export class PostIdComponent implements OnInit, OnDestroy {

  public currentIndexVal: number = -1;
  public activePostId: number = -1;

  currentIndexSubscription: Subscription;
  activePostIdSubscription: Subscription;

  constructor(private __cStore: ComponentStore<PostId>, private store: Store) {
    this.__cStore.setState({
      activeIndex: -1,
      displayProp: '',
      displayVal: ''
    })

    this.currentIndexSubscription = this.__cStore.select((state) => ({
      source: this,
      activeIndex: state.activeIndex,
    })).subscribe(val => this.currentIndexVal = val.activeIndex);

    this.activePostIdSubscription = this.store.select(selectActivePost).subscribe(activePostId => {
      this.activePostId = activePostId;
      if (this.post.id !== activePostId) {
        this.initialiseState();
      }
    })
  }

  public displayProp$ = this.__cStore.select((state) => { return state.displayProp })
  public displaVal$ = this.__cStore.select((state) => { return state.displayVal })

  @Input() post: Post = {
    id: -1,
    userId: -1,
    body: '',
    title: ''
  };

  setValues = this.__cStore.updater(
    (_state, newState: PostId) => { return { ...newState } }
  )

  initialiseState() {
    this.setValues({
      activeIndex: 0,
      displayProp: post_props[0],
      displayVal: this.post[post_props[0] as keyof Post]
    })
  }


  ngOnInit(): void {
    this.initialiseState();
  }

  updateDisplayVals() {

    if (this.activePostId != this.post.id) {
      this.store.dispatch(PostActions.selectActivePost({ activePostId: this.post.id }))
    }

    let updateIndex = (this.currentIndexVal < post_props.length - 1) ? this.currentIndexVal + 1 : 0;
    let updatedProp = post_props[updateIndex];
    let updatedVal = this.post[updatedProp as keyof Post];

    this.setValues({
      activeIndex: updateIndex,
      displayProp: updatedProp,
      displayVal: updatedVal
    })
  }

  ngOnDestroy(): void {
    this.activePostIdSubscription.unsubscribe();
    this.currentIndexSubscription.unsubscribe();
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
