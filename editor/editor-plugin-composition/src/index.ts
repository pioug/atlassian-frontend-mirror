/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { compositionPlugin } from './compositionPlugin';
import type { CompositionPlugin, CompositionState } from './compositionPluginType';

export type { CompositionPlugin, CompositionState };
export { compositionPlugin };
