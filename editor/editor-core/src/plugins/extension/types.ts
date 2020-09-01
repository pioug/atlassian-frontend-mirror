import { ExtensionLayout } from '@atlaskit/adf-schema';
import {
  UpdateExtension,
  ExtensionProvider,
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';

export type ExtensionState<T extends Parameters = Parameters> = {
  layout: ExtensionLayout;
  showEditButton: boolean;
  showContextPanel: boolean;
  updateExtension?: Promise<UpdateExtension<T> | void>;
  element?: HTMLElement;
  extensionProvider?: ExtensionProvider<T>;
  processParametersBefore?: TransformBefore<T>;
  processParametersAfter?: TransformAfter<T>;
};

export type ExtensionAction<T extends Parameters = Parameters> = {
  type: 'UPDATE_STATE';
  data: Partial<ExtensionState<T>>;
};
