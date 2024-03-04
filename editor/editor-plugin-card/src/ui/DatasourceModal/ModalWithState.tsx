import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DatasourceErrorBoundary } from '../../datasourceErrorBoundary';
import type { cardPlugin } from '../../plugin';
import { CardContextProvider } from '../CardContextProvider';

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
    <DatasourceErrorBoundary
      view={editorView}
      datasourceModalType={cardState?.datasourceModalType}
    >
      <CardContextProvider>
        {({ cardContext }) => (
          <DatasourceModal
            view={editorView}
            modalType={cardState?.datasourceModalType}
            cardContext={cardContext}
          />
        )}
      </CardContextProvider>
    </DatasourceErrorBoundary>
  );
};

export default ModalWithState;
