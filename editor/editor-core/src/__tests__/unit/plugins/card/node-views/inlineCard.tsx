import React from 'react';
let mockFindOverflowScrollParent = jest.fn();
let mockRafSchedule = jest.fn().mockImplementation((cb: any) => cb());
jest.mock('raf-schd', () => (cb: any) => () => mockRafSchedule(cb));
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
jest.mock('@atlaskit/editor-common', () => ({
  browser: () => ({}),
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  withImageLoader: jest.fn(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

import { mount } from 'enzyme';
import { inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { InlineCardComponent } from '../../../../../plugins/card/nodeviews/inlineCard';

import { EditorView } from 'prosemirror-view';
import { createCardContext } from '../_helpers';

describe('inlineCard', () => {
  let mockEditorView: EditorView;

  beforeEach(() => {
    mockFindOverflowScrollParent = jest.fn();
    mockEditorView = ({
      state: {
        selection: {
          from: 0,
          to: 0,
        },
        tr: {
          setMeta: jest
            .fn()
            .mockImplementation((_pluginKey: any, action: any) => action),
        },
      },
      dispatch: jest.fn(),
    } as unknown) as EditorView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render (findOverflowScrollParent returning false)', () => {
    mockFindOverflowScrollParent.mockImplementationOnce(() => false);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(undefined);
    mockInlineCardNode.unmount();
  });

  describe('with useAlternativePreloader flag', () => {
    it('should set inlinePreloaderStyle to "on-right-without-skeleton" when enabled', () => {
      const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const mockInlineCardNode = mount(
        <InlineCardComponent
          node={mockInlinePmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
          useAlternativePreloader={true}
        />,
      );
      const wrapper = mockInlineCardNode.find(Card);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('inlinePreloaderStyle')).toBe(
        'on-right-without-skeleton',
      );
    });

    it('should not set inlinePreloaderStyle when not enabled', () => {
      const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const mockInlineCardNode = mount(
        <InlineCardComponent
          node={mockInlinePmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
          useAlternativePreloader={false}
        />,
      );
      const wrapper = mockInlineCardNode.find(Card);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.prop('inlinePreloaderStyle')).toBeUndefined();
    });
  });

  it('should render (findOverflowScrollParent returning node)', () => {
    const scrollContainer = document.createElement('div');
    mockFindOverflowScrollParent.mockImplementationOnce(() => scrollContainer);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(scrollContainer);
    mockInlineCardNode.unmount();
  });

  it('should dispatch REGISTER card action when URL renders', () => {
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );

    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(mockRafSchedule).toHaveBeenCalledTimes(1);
    expect(mockEditorView.state.tr.setMeta).toHaveBeenCalledTimes(1);
    expect(mockEditorView.dispatch).toHaveBeenCalledTimes(1);
    expect(mockEditorView.dispatch).toHaveBeenCalledWith({
      info: {
        pos: 0,
        title: 'my-title',
        url: 'https://my.url.com',
      },
      type: 'REGISTER',
    });
    mockInlineCardNode.unmount();
  });

  it('should not render Card when no cardContext nor data are provided', () => {
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );

    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );

    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(0);

    mockInlineCardNode.unmount();
  });

  it('should render Card when cardContext is not provided but data is provided', () => {
    const mockInlinePmNode = inlineCard({
      url: 'https://some/url',
      data: {},
    })()(defaultSchema);

    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );

    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);

    mockInlineCardNode.unmount();
  });
});
