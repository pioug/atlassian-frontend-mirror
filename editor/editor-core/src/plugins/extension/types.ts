import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import {
  UpdateExtension,
  ExtensionProvider,
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';

export type ExtensionState<T extends Parameters = Parameters> = {
  localId?: string;
  autoSaveResolve?: () => void;
  autoSaveReject?: (reason?: any) => void;
  showEditButton: boolean;
  showContextPanel: boolean;
  updateExtension?: Promise<UpdateExtension<T> | void>;
  element?: HTMLElement;
  extensionProvider?: ExtensionProvider<T>;
  contextIdentifierProvider?: ContextIdentifierProvider;
  processParametersBefore?: TransformBefore<T>;
  processParametersAfter?: TransformAfter<T>;
  positions?: Record<number, number>;
  applyChangeToContextPanel: ApplyChangeHandler | undefined;
};

export type ExtensionAction<T extends Parameters = Parameters> = {
  type: 'UPDATE_STATE';
  data: Partial<ExtensionState<T>>;
};
