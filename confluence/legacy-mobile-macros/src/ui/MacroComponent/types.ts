import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export interface MacroComponentProps {
  extension: ExtensionParams<any>;
  renderingStrategy?: string;
  createPromise: Function;
  eventDispatcher: any;
}
