import { createReducer, on } from '@ngrx/store';
import { PostActions, PostApiActions } from '../actions/posts.actions';
import { Post } from '../models/post';


export const initialState: Post[] = [];

export const postsReducer = createReducer(
    initialState,
    on(PostApiActions.retrievedPostList, (_state, posts) => { return [...posts.posts] })
);

export const activePostReducer = createReducer(
    -1,
    on(PostActions.selectActivePost, (_state, props) => { return props.activePostId })
);