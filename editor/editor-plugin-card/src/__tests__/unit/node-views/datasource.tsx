/**
 * We mock complexity behind link-datasource table component. The goal is to have a way to
 * act externally on it so given impl of onVisibleColumnKeysChange is triggered. That impl.
 * is made in `nodeviews/datasource.tsx` and IS actual target of testing. So the goal of this
 * mock is to 1) Make sure we render expected imported component (DatasourceTableView) and
 * 2) check result of onVisibleColumnKeysChange impl being called.
 */
jest.mock('@atlaskit/link-datasource', () => ({
  ...jest.requireActual('@atlaskit/link-datasource'),
  DatasourceTableView: jest.fn(
    ({
      onVisibleColumnKeysChange,
      onColumnResize,
    }: {
      onVisibleColumnKeysChange: (columnKeys: string[]) => void;
      onColumnResize: (key: string, width: number) => void;
    }) => {
      return (
        <div>
          <button
            data-testid="datasource-table-view-vis-columns-change-mock-activator"
            onClick={() => onVisibleColumnKeysChange(['mock-new-column'])}
          >
            Mock onVisibleColumnKeysChange activation
          </button>

          <button
            data-testid="datasource-table-view-columns-resize-mock-activator"
            onClick={() => onColumnResize('column-2', 42)}
          >
            Mock onColumnResize activation
          </button>
        </div>
      );
    },
  ),
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
import { DatasourceTableView } from '@atlaskit/link-datasource';

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
            columns: [
              { key: 'column-1' },
              { key: 'column-2' },
              { key: 'column-3', width: 44 },
            ],
          },
        },
      ],
    };

    mockBlockPmNode = datasourceBlockCard({
      url: 'some-url',
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
    const table = screen.getByTestId(
      'datasource-table-view-vis-columns-change-mock-activator',
    );
    expect(table).toBeInTheDocument();

    expect(DatasourceTableView).toHaveBeenCalledWith(
      expect.objectContaining({
        datasourceId: 'mock-datasource-id',
        parameters: {
          cloudId: 'mock-cloud-id',
          jql: 'JQL=MOCK',
        },
        visibleColumnKeys: ['column-1', 'column-2', 'column-3'],
        url: 'some-url',
        columnCustomSizes: { 'column-3': 44 },
      }),
      expect.anything(),
    );
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

    const visibleColumnsChangeActivator = getByTestId(
      'datasource-table-view-vis-columns-change-mock-activator',
    );
    fireEvent.click(visibleColumnsChangeActivator);

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

  it('should handle onColumnResize when visible columns are there', () => {
    const { getByTestId } = render(
      <MockCardContextAdapter card={createCardContext()}>
        <DatasourceComponent
          node={mockBlockPmNode}
          view={mockEditorView}
          getPos={() => 0}
        />
      </MockCardContextAdapter>,
    );

    const columnsResizeActivator = getByTestId(
      'datasource-table-view-columns-resize-mock-activator',
    );
    fireEvent.click(columnsResizeActivator);

    const newNodeAttrs = cloneDeep(mockBlockPmNode.attrs);
    if (newNodeAttrs.datasource.views[0]) {
      newNodeAttrs.datasource.views[0].properties.columns = [
        { key: 'column-1' },
        { key: 'column-2', width: 42 },
        { key: 'column-3', width: 44 },
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

  it.each<[string, DatasourceAttributeProperties['views']]>([
    [
      'properties are missing in a table view',
      [
        {
          type: 'table',
        },
      ],
    ],
    [
      'columns are empty in properties of a table view',
      [
        {
          type: 'table',
          properties: {
            columns: [],
          },
        },
      ],
    ],
  ])('should handle onColumnResize when %s', (_, views) => {
    const mockBlockPmNodeWithoutVisibleColumns = datasourceBlockCard({
      url: 'some-url',
      datasource: {
        ...datasourceAttributeProperties,
        views,
      },
    })()(defaultSchema);

    const { getByTestId } = render(
      <MockCardContextAdapter card={createCardContext()}>
        <DatasourceComponent
          node={mockBlockPmNodeWithoutVisibleColumns}
          view={mockEditorView}
          getPos={() => 0}
        />
      </MockCardContextAdapter>,
    );

    const columnsResizeActivator = getByTestId(
      'datasource-table-view-columns-resize-mock-activator',
    );
    fireEvent.click(columnsResizeActivator);

    const newNodeAttrs = cloneDeep(mockBlockPmNodeWithoutVisibleColumns.attrs);
    newNodeAttrs.datasource.views = [
      {
        type: 'table',
        properties: {
          columns: [{ key: 'column-2', width: 42 }],
        },
      },
    ];

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
