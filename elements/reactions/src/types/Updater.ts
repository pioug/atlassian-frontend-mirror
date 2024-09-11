import { type ReactionUpdateSuccess } from './reaction';

export type Updater<T> = (original: T, onSuccess?: ReactionUpdateSuccess) => T | void;
