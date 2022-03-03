import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import {
  UpdateExtension,
  ExtensionProvider,
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';

export type ExtensionState<T extends Parameters = Parameters> = {
  localId?: string;
  autoSaveResolve?: () => void;
  // This is set true whenever selection changes onto an extension node.
  shouldRefreshEditButton: boolean;
  // Used to show/hide the edit button on floating extension toolbar as needed.
  showEditButton: boolean;
  // Current visibility of the context panel.
  showContextPanel: boolean;
  updateExtension?: Promise<UpdateExtension<T> | void>;
  // The DOM element for selected extension node. For position floating toolbar.
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
