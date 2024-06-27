import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Post } from '../models/post';

export const selectPosts = createFeatureSelector<ReadonlyArray<Post>>('posts');

export const selectActivePost = createFeatureSelector<number>('activePost');
