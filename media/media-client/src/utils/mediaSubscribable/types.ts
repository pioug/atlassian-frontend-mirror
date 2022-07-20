export type MediaSubscription = {
  unsubscribe: () => void;
};

type PartialObserver<T> = {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

// Each of these makes one of the PartialObserver attrs required:
export type NextObserver<T> = PartialObserver<T> &
  Required<Pick<PartialObserver<T>, 'next'>>;
export type ErrorObserver<T> = PartialObserver<T> &
  Required<Pick<PartialObserver<T>, 'error'>>;
export type CompletionObserver<T> = PartialObserver<T> &
  Required<Pick<PartialObserver<T>, 'complete'>>;

export type MediaObserver<T> =
  | NextObserver<T>
  | ErrorObserver<T>
  | CompletionObserver<T>
  | ((value: T) => void);

export type MediaSubscribable<T> = {
  subscribe(observer?: MediaObserver<T>): MediaSubscription;
};
