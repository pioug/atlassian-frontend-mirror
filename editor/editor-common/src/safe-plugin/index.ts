import {
  Plugin,
  PluginSpec,
  SafePluginSpec,
} from '@atlaskit/editor-prosemirror/state';

export class SafePlugin<T = any> extends Plugin<T> {
  // This variable isn't (and shouldn't) be used anywhere. Its purpose is
  // to distinguish Plugin from SafePlugin, thus ensuring that an 'unsafe'
  // Plugin cannot be assigned as an item in EditorPlugin → pmPlugins.
  _isATypeSafePlugin!: never;

  constructor(spec: SafePluginSpec<T>) {
    super(spec as PluginSpec<T>);
  }
}
