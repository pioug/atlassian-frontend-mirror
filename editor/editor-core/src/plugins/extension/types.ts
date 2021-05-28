import { ExtensionLayout } from '@atlaskit/adf-schema';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import {
  UpdateExtension,
  ExtensionProvider,
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';

export type ExtensionState<T extends Parameters = Parameters> = {
  layout: ExtensionLayout;
  localId?: string;
  autoSaveResolve?: () => void;
  showEditButton: boolean;
  showContextPanel: boolean;
  updateExtension?: Promise<UpdateExtension<T> | void>;
  element?: HTMLElement;
  extensionProvider?: ExtensionProvider<T>;
  contextIdentifierProvider?: ContextIdentifierProvider;
  processParametersBefore?: TransformBefore<T>;
  processParametersAfter?: TransformAfter<T>;
  positions?: Record<number, number>;
};

export type ExtensionAction<T extends Parameters = Parameters> = {
  type: 'UPDATE_STATE';
  data: Partial<ExtensionState<T>>;
};
