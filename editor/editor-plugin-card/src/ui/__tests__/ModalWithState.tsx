import React from 'react';

import { render } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';

import { DatasourceModalType } from '@atlaskit/editor-common/types';

import ModalWithState from '../DatasourceModal/ModalWithState';

const getMockAPI: any = (
  datasourceModalType?: DatasourceModalType,
  showDatasourceModal?: boolean,
) => ({
  dependencies: {
    card: {
      sharedState: {
        getSharedState: () => {},
        currentState: () => ({ datasourceModalType, showDatasourceModal }),
        onChange: () => {},
      },
    },
  },
});

const mockEditorView = {
  state: {},
  dispatch: jest.fn(),
} as unknown as EditorView;

describe('ModalWithState', () => {
  it('should render DatasourceModal when datasourceModalType is defined', () => {
    const { getByTestId } = render(
      <ModalWithState
        editorView={mockEditorView}
        api={getMockAPI('jira', true)}
      />,
    );

    const jiraModal = getByTestId(`jira-config-modal`);
    expect(jiraModal).toBeInTheDocument();
  });

  it('should not render DatasourceModal when datasourceModalType is undefined', () => {
    const { container } = render(
      <ModalWithState editorView={mockEditorView} api={getMockAPI()} />,
    );

    expect(container).toMatchInlineSnapshot(`<div />`);
  });
});
