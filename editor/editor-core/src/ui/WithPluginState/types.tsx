import { PluginKey } from 'prosemirror-state';

export type NamedPluginKeys = Readonly<{ [stateName: string]: PluginKey }>;
export type NamedPluginStates<P extends NamedPluginKeys> = Readonly<
  Partial<{ [K in keyof P]: P[K] extends PluginKey<infer T> ? T : never }>
>;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
