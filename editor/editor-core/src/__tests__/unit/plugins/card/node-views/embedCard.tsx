import React from 'react';
import { mount } from 'enzyme';
import { embedCard, doc } from '@atlaskit/editor-test-helpers/schema-builder';
import { Card } from '@atlaskit/smart-card';
import { EmbedCardComponent } from '../../../../../plugins/card/nodeviews/embedCard';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { CardOptions } from '../../../../../plugins/card';
import ResizableEmbedCard from '../../../../../plugins/card/ui/ResizableEmbedCard';
import { DispatchAnalyticsEvent } from '../../../../../plugins/analytics';
import { createCardContext } from '../_helpers';

describe('EmbedCard', () => {
  const createEditor = createEditorFactory();
  let mockDispatchAnalytics: DispatchAnalyticsEvent;
  const editor = (doc: any, cardProps?: Partial<CardOptions>) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_cards: {
          allowEmbeds: true,
          ...cardProps,
        },
      },
    });
  };

  beforeEach(() => {
    mockDispatchAnalytics = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const mockInlinePmNode = embedCard({
      url: 'https://some/url',
      layout: 'center',
    })();
    const { editorView } = editor(doc(mockInlinePmNode));
    const node = editorView.state.doc.firstChild;

    const mockInlineCardNode = mount(
      <EmbedCardComponent
        node={node!}
        view={editorView}
        getPos={() => 0}
        dispatchAnalyticsEvent={mockDispatchAnalytics}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    mockInlineCardNode.unmount();
  });

  it('does not render resizer handles', () => {
    const mockInlinePmNode = embedCard({
      url: 'https://some/url',
      layout: 'center',
    })();
    const { editorView } = editor(doc(mockInlinePmNode), {
      allowResizing: true,
    });
    const node = editorView.state.doc.firstChild;

    const mockInlineCardNode = mount(
      <EmbedCardComponent
        node={node!}
        view={editorView}
        getPos={() => 0}
        allowResizing={false}
        dispatchAnalyticsEvent={mockDispatchAnalytics}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockInlineCardNode.find(ResizableEmbedCard);
    expect(wrapper).toHaveLength(0);
    const cardWrapper = mockInlineCardNode.find(Card);
    expect(cardWrapper).toHaveLength(1);
    mockInlineCardNode.unmount();
  });
});
