import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { render } from '@testing-library/react';
import type { DatasourceAdf } from '@atlaskit/smart-card';

import { DatasourceModal } from '../DatasourceModal';

const mockEditorState = {} as EditorState;
const mockEditorView = {
  state: {},
  dispatch: jest.fn(),
} as unknown as EditorView;

const mockJiraDatasourceNode: DatasourceAdf = {
  type: 'blockCard',
  attrs: {
    datasource: {
      id: 'datasource-id',
      parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
      views: [
        {
          type: 'table',
          properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
        },
      ],
    },
  },
};

const mockDatasourceNode: DatasourceAdf = {
  type: 'blockCard',
  attrs: {
    datasource: {
      id: 'datasource-id',
      parameters: { cloudId: 'cloud-id' },
      views: [
        {
          type: 'table',
          properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
        },
      ],
    },
  },
};

describe('DatasourceModal', () => {
  it('should render jira modal if node has JQL in it', async () => {
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <DatasourceModal
          state={mockEditorState}
          view={mockEditorView}
          node={mockJiraDatasourceNode as any}
        />
      </IntlProvider>,
    );

    const jiraModal = getByTestId('jira-config-modal');
    expect(jiraModal).toBeInTheDocument();
  });

  it('should not render jira modal if node does not have JQL in it', async () => {
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <DatasourceModal
          state={mockEditorState}
          view={mockEditorView}
          node={mockDatasourceNode as any}
        />
      </IntlProvider>,
    );

    const jiraModal = queryByTestId('jira-config-modal');
    expect(jiraModal).not.toBeInTheDocument();
  });
});
