jest.mock('@atlaskit/link-datasource', () => ({
  ...jest.requireActual('@atlaskit/link-datasource'),
  DatasourceTableView: ({
    onVisibleColumnKeysChange,
  }: {
    onVisibleColumnKeysChange: (columnKeys: string[]) => void;
  }) => {
    return (
      <button
        data-testid="mock-datasource-table-view"
        onClick={() => onVisibleColumnKeysChange(['mock-new-column'])}
      >
        Mock Datasource Table View
      </button>
    );
  },
  __esModule: true,
}));

jest.mock('@atlaskit/smart-card', () => {
  const React = require('react');
  return {
    ...jest.requireActual<Object>('@atlaskit/smart-card'),
    Card: class Card extends React.Component<any> {
      render() {
        this.props.onResolve({
          title: 'my-title',
          url: 'https://my.url.com',
        });
        return <div className="smart-card-mock">{this.props.url}</div>;
      }
    },
  };
});
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import type { RefsNode } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { datasourceBlockCard } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { DatasourceComponent } from '../../../nodeviews/datasource';
import { MockCardContextAdapter } from '../../../ui/__tests__/_utils/mock-card-context';
import { createCardContext } from '../_helpers';

describe('blockCard with datasource attrs', () => {
  let mockEditorView: EditorView;
  let mockTr: Partial<EditorView['state']['tr']>;
  let datasourceAttributeProperties: DatasourceAttributeProperties;
  let mockBlockPmNode: RefsNode;

  beforeEach(() => {
    datasourceAttributeProperties = {
      id: 'mock-datasource-id',
      parameters: {
        cloudId: 'mock-cloud-id',
        jql: 'JQL=MOCK',
      },
      views: [
        {
          type: 'table',
          properties: {
            columns: [{ key: 'column-1' }, { key: 'column-2' }],
          },
        },
      ],
    };

    mockBlockPmNode = datasourceBlockCard({
      datasource: datasourceAttributeProperties,
    })()(defaultSchema);

    mockTr = {
      setMeta: jest
        .fn()
        .mockImplementation((_pluginKey: any, action: any) => action),
      setNodeMarkup: jest.fn().mockImplementation(() => mockTr),
    };

    mockEditorView = {
      state: {
        selection: {
          from: 0,
          to: 0,
        },
        tr: mockTr,
      },
      dispatch: jest.fn(),
    } as unknown as EditorView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call datasource component with datasource attrs', async () => {
    // unblock prosemirror bump
    (mockBlockPmNode as any).attrs = {
      ...mockBlockPmNode.attrs,
      datasource: datasourceAttributeProperties,
    };

    render(
      <MockCardContextAdapter card={createCardContext()}>
        <DatasourceComponent
          node={mockBlockPmNode}
          view={mockEditorView}
          getPos={() => 0}
        />
      </MockCardContextAdapter>,
    );

    expect(screen.queryByTestId('smart-card-mock')).not.toBeInTheDocument();
    const table = screen.getByTestId('mock-datasource-table-view');
    expect(table).toBeInTheDocument();
  });

  it('should handle onVisibleColumnKeysChange', () => {
    const { getByTestId } = render(
      <MockCardContextAdapter card={createCardContext()}>
        <DatasourceComponent
          node={mockBlockPmNode}
          view={mockEditorView}
          getPos={() => 0}
        />
      </MockCardContextAdapter>,
    );

    const jiraIssuesTableMock = getByTestId('mock-datasource-table-view');
    fireEvent.click(jiraIssuesTableMock);

    const newNodeAttrs = cloneDeep(mockBlockPmNode.attrs);
    if (newNodeAttrs.datasource.views[0]) {
      newNodeAttrs.datasource.views[0].properties.columns = [
        { key: 'mock-new-column' },
      ];
    }

    expect(mockTr.setNodeMarkup).toHaveBeenCalledWith(
      0,
      undefined,
      newNodeAttrs,
    );
    expect(mockTr.setMeta).toHaveBeenCalledWith('addToHistory', false);
    expect(mockTr.setMeta).toHaveBeenCalledWith('scrollIntoView', false);
    expect(mockEditorView.dispatch).toHaveBeenCalledWith(mockTr);
  });
});
