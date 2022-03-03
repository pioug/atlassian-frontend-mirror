import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export class CustomLegacyMacroError {
  constructor() {}
}

export interface CustomLegacyMacroResponse {
  html: string;
  resources: {
    css?: string;
    data?: string;
    js?: string;
  };
}

export interface InlineSSRMacroComponentProps {
  contentId: number;
  baseUrl: string;
  extension: ExtensionParams<any>;
  outputDeviceType: 'MOBILE' | 'DESKTOP';
  createPromise: Function;
  renderFallback: Function;
  onLinkClick: Function;
}
