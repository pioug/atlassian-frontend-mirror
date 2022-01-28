import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export type CreateMacro = {
  isDisabled: boolean;
  action: any;
  onClick?: ((...args: any[]) => void) | null;
  errorMessage?: string;
  secondaryAction: any;
};

export type ActionProps = {
  callToAction?: boolean;
};

export interface MacroFallbackComponentProps {
  extension: ExtensionParams<any>;
  createPromise: Function;
  eventDispatcher: any;
}
