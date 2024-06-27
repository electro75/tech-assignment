import { createReducer, on } from '@ngrx/store';
import { PostApiActions } from '../actions/posts.actions';
import { Post } from '../models/post';


export const initialState: Post[] = [];

export const postsReducer = createReducer(
    initialState,
    on(PostApiActions.retrievedPostList, (_state, posts) => { return [...posts.posts] })
);

export const activePostReducer = createReducer(
    -1,
)