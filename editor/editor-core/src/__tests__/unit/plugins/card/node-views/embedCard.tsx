let mockFindOverflowScrollParent = jest.fn();
jest.mock('@atlaskit/editor-common', () => ({
  browser: () => ({}),
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  withImageLoader: jest.fn(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

import React from 'react';
import { mount } from 'enzyme';
import { embedCard } from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { EmbedCardComponent } from '../../../../../plugins/card/nodeviews/embedCard';
import { EditorView } from 'prosemirror-view';

describe('EmbedCard', () => {
  let mockEditorView: EditorView;

  beforeEach(() => {
    mockFindOverflowScrollParent = jest.fn();
    mockEditorView = {
      state: {
        selection: {
          from: 0,
          to: 0,
        },
      },
    } as EditorView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    mockFindOverflowScrollParent.mockImplementationOnce(() => false);
    const mockInlinePmNode = embedCard({
      url: 'https://some/url',
      layout: 'center',
    })()(defaultSchema);

    const mockInlineCardNode = mount(
      <EmbedCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    mockInlineCardNode.unmount();
  });
});
