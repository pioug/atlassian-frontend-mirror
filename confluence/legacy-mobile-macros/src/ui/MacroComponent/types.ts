import { ExtensionParams } from '@atlaskit/editor-common';

export interface MacroRendererProps {
  extension: ExtensionParams<any>;
  macroWhitelist: Array<string>;
  createPromise: Function;
  eventDispatcher: any;
}

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
