// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import basePlugin from './basePlugin';
import type { BasePlugin, BasePluginOptions, BasePluginState, Callback } from './basePluginType';
import type { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter/plugin';

export { basePlugin };
export type { BasePlugin, BasePluginState, BasePluginOptions, ScrollGutterPluginOptions, Callback };
