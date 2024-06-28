import { createActionGroup, props } from '@ngrx/store';
import { Post } from '../models/post';


export const PostApiActions = createActionGroup({
    source: 'Posts API',
    events: {
        'Retrieved Post List': props<{ posts: ReadonlyArray<Post> }>(),
    },
});

export const PostActions = createActionGroup({
    source: 'Posts',
    events: {
        'Select Active Post': props<{ activePostId: number }>()
    }
})