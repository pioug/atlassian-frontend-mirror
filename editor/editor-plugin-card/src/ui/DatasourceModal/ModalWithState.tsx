import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DatasourceErrorBoundary } from '../../datasourceErrorBoundary';
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
    <DatasourceErrorBoundary view={editorView}>
      <DatasourceModal
        view={editorView}
        modalType={cardState?.datasourceModalType}
      />
    </DatasourceErrorBoundary>
  );
};

export default ModalWithState;
