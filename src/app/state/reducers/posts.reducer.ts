import { createReducer, on } from '@ngrx/store';
import { PostActions, PostApiActions } from '../actions/posts.actions';
import { Post } from '../models/post';


const initialState: Post[] = [];
const initialActivePostId: number = -1;

// handles the post list
export const postsReducer = createReducer(
    initialState,
    on(PostApiActions.retrievedPostList, (_state, posts) => { return [...posts.posts] })
);

// handles current active post ID
export const activePostReducer = createReducer(
    initialActivePostId,
    on(PostActions.selectActivePost, (_state, props) => { return props.activePostId })
);