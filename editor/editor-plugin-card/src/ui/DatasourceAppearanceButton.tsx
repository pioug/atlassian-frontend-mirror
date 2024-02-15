/** @jsx jsx */
import { useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import TableIcon from '@atlaskit/icon/glyph/table';
import { buildDatasourceAdf } from '@atlaskit/link-datasource';
import type { CardContext } from '@atlaskit/link-provider';
import type { DatasourceAdf } from '@atlaskit/linking-common/types';
import { Flex } from '@atlaskit/primitives';

import { updateCardViaDatasource } from '../pm-plugins/doc';

import { CardContextProvider } from './CardContextProvider';
import { useFetchDatasourceInfo } from './useFetchDatasourceInfo';

export interface DatasourceAppearanceButtonProps {
  intl: IntlShape;
  editorAnalyticsApi?: EditorAnalyticsAPI;
  url: string;
  editorView?: EditorView;
  editorState: EditorState;
  cardContext?: CardContext;
  selected?: boolean;
}

const buttonStyles = css({
  pointerEvents: 'auto',
});

const DatasourceAppearanceButtonWithCardContext = ({
  cardContext,
  intl,
  url,
  editorView,
  editorState,
  selected,
}: DatasourceAppearanceButtonProps) => {
  const { datasourceId, parameters } = useFetchDatasourceInfo({
    isRegularCardNode: true,
    url,
    cardContext,
  });

  const onChangeAppearance = useCallback(() => {
    if (!editorView || !datasourceId || !parameters) {
      return;
    }
    const newAdf: DatasourceAdf = buildDatasourceAdf(
      {
        id: datasourceId,
        parameters,
        views: [{ type: 'table' }],
      },
      url,
    );

    const { selection } = editorState;
    const existingNode =
      selection instanceof NodeSelection ? selection.node : undefined;
    if (existingNode) {
      updateCardViaDatasource(
        editorState,
        existingNode,
        newAdf,
        editorView,
        undefined,
      );
    }
  }, [parameters, datasourceId, editorState, editorView, url]);

  if (!parameters || !datasourceId || !canRenderDatasource(datasourceId)) {
    return null;
  }

  if (url) {
    const urlState = cardContext?.store?.getState()[url];
    if (urlState?.error?.kind === 'fatal') {
      return null;
    }
  }

  const buttonLabel = intl.formatMessage(messages.datasourceAppearanceTitle);

  return (
    <Flex>
      <Button
        css={buttonStyles}
        title={buttonLabel}
        icon={<TableIcon label={buttonLabel} />}
        selected={selected}
        onClick={onChangeAppearance}
        testId={'card-datasource-appearance-button'}
      />
    </Flex>
  );
};

export const DatasourceAppearanceButton = ({
  intl,
  editorAnalyticsApi,
  url,
  editorView,
  editorState,
  selected,
}: DatasourceAppearanceButtonProps) => {
  return (
    <CardContextProvider>
      {({ cardContext }) => (
        <DatasourceAppearanceButtonWithCardContext
          url={url}
          intl={intl}
          editorAnalyticsApi={editorAnalyticsApi}
          editorView={editorView}
          editorState={editorState}
          cardContext={cardContext}
          selected={selected}
        />
      )}
    </CardContextProvider>
  );
};
