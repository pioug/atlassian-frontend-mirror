import React, { useEffect } from 'react';

import { EditorView } from 'prosemirror-view';

import { EmbedCardAttributes } from '@atlaskit/adf-schema';
import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { embedCard, RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { renderWithIntl as render } from '@atlaskit/media-test-helpers/renderWithIntl';

import { getPluginState } from '../../../pm-plugins/util/state';
import { Card } from '../../genericCard';

jest.mock('../../../pm-plugins/util/state', () => {
  const originalModule = jest.requireActual('../../../pm-plugins/util/state');

  return {
    ...originalModule,
    getPluginState: jest.fn(),
  };
});

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
    (getPluginState as any).mockImplementation(() => {
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
