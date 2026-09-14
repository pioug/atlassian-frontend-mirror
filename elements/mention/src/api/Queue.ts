import type { Callback } from './Callback';

export /** A queue for user ids */
type Queue = Map<string, Callback[]>;
