import { EventEmitter2 } from 'eventemitter2';
import { LRUMap } from 'lru_map';
import { type ReplaySubject } from 'rxjs/ReplaySubject';

export interface StateDeferredValue<T> {
  promise: Promise<T>;
  resolve: Function;
  value?: T;
}

export interface CachedMediaState<T> {
  streams: LRUMap<string, ReplaySubject<T>>;
  stateDeferreds: Map<string, StateDeferredValue<T>>;
  eventEmitter?: EventEmitter2;
}

export const mediaState: CachedMediaState<Object> = {
  streams: new LRUMap<string, ReplaySubject<Object>>(1000),
  stateDeferreds: new Map<string, StateDeferredValue<Object>>(),
  eventEmitter: new EventEmitter2(),
};
