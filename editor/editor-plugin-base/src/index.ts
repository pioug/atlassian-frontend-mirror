import basePlugin from './plugin';
import type { BasePlugin, BasePluginOptions, BasePluginState } from './plugin';
import type { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter';

export { basePlugin };
export type {
  BasePlugin,
  BasePluginState,
  BasePluginOptions,
  ScrollGutterPluginOptions,
};
export {
  NORMAL_SEVERITY_THRESHOLD,
  DEGRADED_SEVERITY_THRESHOLD,
} from './pm-plugins/frozen-editor';
export { setKeyboardHeight } from './commands';
