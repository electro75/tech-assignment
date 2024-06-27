import { createReducer, on } from '@ngrx/store';

export const initialState = {
    posts: [],
};

export const postsReducer = createReducer(
    initialState
);

export const activePostReducer = createReducer(
    -1,
)