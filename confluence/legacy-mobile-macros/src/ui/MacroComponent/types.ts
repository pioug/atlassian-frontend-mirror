import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export interface MacroComponentProps {
  extension: ExtensionParams<any>;
  contentId: number;
  baseUrl: string;
  renderingStrategy?: string;
  createPromise: Function;
  eventDispatcher: any;
  onLinkClick: Function;
}
