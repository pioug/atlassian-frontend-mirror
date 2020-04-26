import { NodeWithPos } from 'prosemirror-utils';
import { ExtensionLayout } from '@atlaskit/adf-schema';
import {
  UpdateExtension,
  ExtensionProvider,
  ParametersGetter,
  AsyncParametersGetter,
} from '@atlaskit/editor-common/extensions';

export type ExtensionState = {
  layout: ExtensionLayout;
  showEditButton: boolean;
  showContextPanel: boolean;
  updateExtension?: UpdateExtension<object>;
  nodeWithPos?: NodeWithPos;
  element?: HTMLElement;
  extensionProvider?: ExtensionProvider;
  processParametersBefore?: ParametersGetter;
  processParametersAfter?: AsyncParametersGetter;
};

export type ExtensionAction = {
  type: 'UPDATE_STATE';
  data: Partial<ExtensionState>;
};
