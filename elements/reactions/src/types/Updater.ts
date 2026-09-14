import { type ReactionUpdateFailure, type ReactionUpdateSuccess } from './reaction';

export type Updater<T> = (
	original: T,
	onSuccess?: ReactionUpdateSuccess,
	onFailure?: ReactionUpdateFailure,
) => T | void;
