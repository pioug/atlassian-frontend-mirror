import { Schema } from 'prosemirror-model';
import { Transformer } from '@atlaskit/editor-common';
import EditorActions from '../../../actions';
import { EditorPlugin } from '../../../types';
import { FireAnalyticsCallback } from '../../../plugins/analytics';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export type EditorProps = {
  plugins?: Array<EditorPlugin>;
  transformer?: (schema: Schema) => Transformer<any>;
  children?: React.ReactChild;

  // Set the default editor content.
  defaultValue?: string | object;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  disabled?: boolean;
  placeholder?: string;

  // Set for handling/dispatching analytics events
  onAnalyticsEvent?: FireAnalyticsCallback;

  // Set for an on change callback.
  onChange?: (value: any, meta: { source: 'remote' | 'local' }) => void;

  // Set for an on save callback.
  onSave?: (value: any) => void;

  // Set for an on cancel callback.
  onCancel?: (value: any) => void;

  onMount?: (actions: EditorActions) => void;
  onDestroy?: () => void;
};

export type EditorPropsExtended = EditorProps & {
  portalProviderAPI: PortalProviderAPI;
};
