import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { cardPlugin } from '../../plugin';

import { DatasourceModal } from './index';

const ModalWithState = ({
  api,
  editorView,
}: {
  api: ExtractInjectionAPI<typeof cardPlugin> | undefined;
  editorView: EditorView;
}) => {
  const { cardState } = useSharedPluginState(api, ['card']);

  if (!cardState?.showDatasourceModal) {
    return null;
  }

  return (
    <DatasourceModal
      view={editorView}
      modalType={cardState?.datasourceModalType}
    />
  );
};

export default ModalWithState;
