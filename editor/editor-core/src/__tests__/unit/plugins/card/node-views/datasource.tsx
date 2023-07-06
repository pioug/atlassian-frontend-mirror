import { createCardContext } from '../_helpers';

jest.mock('@atlaskit/link-datasource', () => ({
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

import { mount } from 'enzyme';
import {
  RefsNode,
  datasourceBlockCard,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { DatasourceComponent } from '../../../../../plugins/card/nodeviews/datasource';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import cloneDeep from 'lodash/cloneDeep';
import { EditorView } from 'prosemirror-view';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

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

  it('should call datasource component with datasouce attrs', async () => {
    // unblock prosemirror bump
    (mockBlockPmNode as any).attrs = {
      ...mockBlockPmNode.attrs,
      datasource: datasourceAttributeProperties,
    };

    const mockBlockCardDatasourceNode = mount(
      <DatasourceComponent
        node={mockBlockPmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
      {
        context: {
          contextAdapter: {
            card: createCardContext(),
          },
        },
      },
    );

    const wrapper = mockBlockCardDatasourceNode.find(Card);
    expect(wrapper).toHaveLength(0);
    const table = mockBlockCardDatasourceNode.find(DatasourceTableView);
    expect(table).toHaveLength(1);
    expect(table.prop('datasourceId')).toEqual('mock-datasource-id');
    expect(table.prop('parameters')).toEqual({
      cloudId: 'mock-cloud-id',
      jql: 'JQL=MOCK',
    });
    expect(table.prop('visibleColumnKeys')).toEqual(['column-1', 'column-2']);
  });

  it('should handle onVisibleColumnKeysChange', () => {
    const wrapper = mount(
      <DatasourceComponent
        node={mockBlockPmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
      {
        context: {
          contextAdapter: {
            card: createCardContext(),
          },
        },
      },
    );

    const jiraIssuesTableMock = wrapper.find(
      '[data-testid="mock-datasource-table-view"]',
    );
    jiraIssuesTableMock.at(0).simulate('click');

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
    expect(mockEditorView.dispatch).toHaveBeenCalledWith(mockTr);
  });
});
