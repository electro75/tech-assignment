import { Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Post } from '../../state/models/post';
import { post_props } from '../../constants/constants';

@Component({
  selector: 'app-post-id',
  standalone: true,
  imports: [],
  templateUrl: './post-id.component.html',
  styleUrl: './post-id.component.scss'
})
export class PostIdComponent {

  @Input() post: Post = {};
  public activePropIdx: number = 0;


  // naive approach - causes too many renders. App will get laggy for larger datasets
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
