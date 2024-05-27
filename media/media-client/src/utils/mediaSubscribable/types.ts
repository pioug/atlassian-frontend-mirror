import { type FileState } from '@atlaskit/media-state';

export type MediaSubscription = {
  unsubscribe: () => void;
};

type PartialObserver = {
  next?: (value: FileState) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

// Each of these makes one of the PartialObserver attrs required:
export type NextObserver = PartialObserver &
  Required<Pick<PartialObserver, 'next'>>;
export type ErrorObserver = PartialObserver &
  Required<Pick<PartialObserver, 'error'>>;
export type CompletionObserver = PartialObserver &
  Required<Pick<PartialObserver, 'complete'>>;

export type MediaObserver =
  | NextObserver
  | ErrorObserver
  | CompletionObserver
  | ((value: FileState) => void);

export type MediaSubscribable = {
  subscribe(observer?: MediaObserver): MediaSubscription;
};
