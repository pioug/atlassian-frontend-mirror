import React from 'react';
import { browser } from '@atlaskit/editor-common';

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
  browser: {
    ie: false,
    ie_version: 0,
  },
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  withImageLoader: jest.fn(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

import { mount, shallow } from 'enzyme';
import { blockCard } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { BlockCardComponent } from '../../../../../plugins/card/nodeviews/blockCard';
import { EditorView } from 'prosemirror-view';
import { createCardContext } from '../_helpers';
describe('blockCard', () => {
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
    const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockBlockCardNode = shallow(
      <BlockCardComponent
        node={mockBlockCardPmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockBlockCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(undefined);
  });

  it('should render (findOverflowScrollParent returning node)', () => {
    const scrollContainer = document.createElement('div');
    mockFindOverflowScrollParent.mockImplementationOnce(() => scrollContainer);
    const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockBlockCardNode = shallow(
      <BlockCardComponent
        node={mockBlockCardPmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );
    const wrapper = mockBlockCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(scrollContainer);
  });

  it('should call registerCard when URL renders', () => {
    const mockBlockPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockBlockCardNode = mount(
      <BlockCardComponent
        node={mockBlockPmNode}
        view={mockEditorView}
        getPos={() => 0}
        cardContext={createCardContext()}
      />,
    );

    const wrapper = mockBlockCardNode.find(Card);
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
  });

  describe('give the browser is Edge 44 or below', () => {
    it('should NOT render span after SmartCard to stop edit popup rendering to low', () => {
      browser.ie = true;
      browser.ie_version = 18;
      const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const mockBlockCardNode = shallow(
        <BlockCardComponent
          node={mockBlockCardPmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
        />,
      );

      expect(
        mockBlockCardNode.contains(<span contentEditable={true} />),
      ).toEqual(false);
    });
  });

  describe('give the browser is Chromium', () => {
    it('should render a span after SmartCard to fix GAP cursor bug', () => {
      browser.ie = false;
      browser.ie_version = 0;
      const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
        defaultSchema,
      );
      const mockBlockCardNode = shallow(
        <BlockCardComponent
          node={mockBlockCardPmNode}
          view={mockEditorView}
          getPos={() => 0}
          cardContext={createCardContext()}
        />,
      );

      expect(
        mockBlockCardNode.contains(<span contentEditable={true} />),
      ).toEqual(true);
    });
  });
});
