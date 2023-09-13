import React, { useEffect } from 'react';

import type { EmbedCardAttributes } from '@atlaskit/adf-schema';
import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import type { RefsNode } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  datasourceBlockCard,
  embedCard,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { renderWithIntl as render } from '@atlaskit/media-test-helpers/renderWithIntl';

import { createCardContext } from '../../../__tests__/unit/_helpers';
import { DatasourceComponent } from '../../../nodeviews/datasource';
import { getPluginState } from '../../../pm-plugins/util/state';
import { MockCardContextAdapter } from '../../../ui/__tests__/_utils/mock-card-context';
import { Card } from '../../genericCard';

jest.mock('../../../pm-plugins/util/state', () => {
  const originalModule = jest.requireActual('../../../pm-plugins/util/state');

  return {
    ...originalModule,
    getPluginState: jest.fn(),
  };
});

const MockedDatasourceComponent = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  useEffect(() => {
    createAnalyticsEvent({}).fire();
  }, [createAnalyticsEvent]);

  return <div />;
};

jest.mock('@atlaskit/link-datasource', () => ({
  ...jest.requireActual('@atlaskit/link-datasource'),
  DatasourceTableView: () => <MockedDatasourceComponent />,
  __esModule: true,
}));

describe('Generic card analytics', () => {
  let mockEditorView: EditorView;
  const spy = jest.fn();
  let WrappedCard: React.ComponentType<any>;
  let mockEmbedPmNode: RefsNode;

  beforeEach(() => {
    const url = 'https://some/url';
    const MockComponent = jest.fn();
    MockComponent.mockImplementation(() => {
      const { createAnalyticsEvent } = useAnalyticsEvents();

      useEffect(() => {
        createAnalyticsEvent({}).fire();
      }, [createAnalyticsEvent]);

      return <div />;
    });
    mockEmbedPmNode = embedCard({ url } as EmbedCardAttributes)()(
      defaultSchema,
    );
    WrappedCard = Card(MockComponent, () => {
      return null;
    });

    mockEditorView = {
      state: {},
      dispatch: jest.fn(),
    } as unknown as EditorView;
  });

  it('fires analytics for location for unknown editor appearance', () => {
    render(
      <AnalyticsListener onEvent={spy}>
        <WrappedCard node={mockEmbedPmNode} view={{ mockEditorView }} />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `_unknown`,
            }),
          }),
        ],
      }),
      undefined,
    );
  });

  it('fires analytics for location when full-width editor appearance set', () => {
    (getPluginState as any).mockImplementationOnce(() => {
      return { editorAppearance: 'full-width' };
    });

    render(
      <AnalyticsListener onEvent={spy}>
        <WrappedCard node={mockEmbedPmNode} view={mockEditorView} />
      </AnalyticsListener>,
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `editor_fullWidth`,
            }),
          }),
        ],
      }),
      undefined,
    );
  });
});

describe('DatasourceComponent analytics', () => {
  const datasourceAttributeProperties = {
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

  const mockTr: Partial<EditorView['state']['tr']> = {
    setMeta: jest
      .fn()
      .mockImplementation((_pluginKey: any, action: any) => action),
    setNodeMarkup: jest.fn().mockImplementation(() => mockTr),
  };

  const mockEditorView = {
    state: {
      selection: {
        from: 0,
        to: 0,
      },
      tr: mockTr,
    },
    dispatch: jest.fn(),
  } as unknown as EditorView;

  const mockBlockPmNode = datasourceBlockCard({
    datasource: datasourceAttributeProperties,
  })()(defaultSchema);

  const spy = jest.fn();

  const setup = () => {
    render(
      <AnalyticsListener onEvent={spy}>
        <MockCardContextAdapter card={createCardContext()}>
          <DatasourceComponent
            node={mockBlockPmNode}
            view={mockEditorView}
            getPos={() => 0}
          />
        </MockCardContextAdapter>
      </AnalyticsListener>,
    );
  };

  it('fires analytics for location for unknown editor appearance', async () => {
    setup();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `_unknown`,
            }),
          }),
        ],
      }),
      undefined,
    );
  });

  it('fires analytics for location when full-width editor appearance set', async () => {
    (getPluginState as any).mockImplementationOnce(() => {
      return { editorAppearance: 'full-width' };
    });

    setup();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          expect.objectContaining({
            attributes: expect.objectContaining({
              location: `editor_fullWidth`,
            }),
          }),
        ],
      }),
      undefined,
    );
  });
});
