import { createReducer, on } from '@ngrx/store';
import { PostActions, PostApiActions } from '../actions/posts.actions';
import { Post } from '../models/post';


const initialState: Post[] = [];
const initialActivePostId: number = -1;

export const postsReducer = createReducer(
    initialState,
    on(PostApiActions.retrievedPostList, (_state, posts) => { return [...posts.posts] })
);

export const activePostReducer = createReducer(
    initialActivePostId,
    on(PostActions.selectActivePost, (_state, props) => { return props.activePostId })
);