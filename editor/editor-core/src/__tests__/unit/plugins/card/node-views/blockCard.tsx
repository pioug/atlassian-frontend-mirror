import React from 'react';
let mockFindOverflowScrollParent = jest.fn();
let mockRafSchedule = jest.fn().mockImplementation((cb: any) => cb());
jest.mock('raf-schd', () => (cb: any) => () => mockRafSchedule(cb));
jest.mock('@atlaskit/smart-card', () => ({
  Card: class Card extends React.Component<any> {
    render() {
      this.props.onResolve({
        title: 'my-title',
        url: 'https://my.url.com',
      });
      return <div className="smart-card-mock">{this.props.url}</div>;
    }
  },
}));
jest.mock('@atlaskit/editor-common', () => ({
  browser: () => ({}),
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  withImageLoader: jest.fn(),
  overflowShadow: jest.fn(),
  sharedExpandStyles: jest.fn(),
  WidthProvider: jest.fn(),
}));

import { mount } from 'enzyme';
import { blockCard } from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Card } from '@atlaskit/smart-card';

import { BlockCardComponent } from '../../../../../plugins/card/nodeviews/blockCard';
import { EditorView } from 'prosemirror-view';

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
    const mockBlockCardNode = mount(
      <BlockCardComponent
        node={mockBlockCardPmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
      />,
    );
    const wrapper = mockBlockCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(undefined);
    mockBlockCardNode.unmount();
  });

  it('should render (findOverflowScrollParent returning node)', () => {
    const scrollContainer = document.createElement('div');
    mockFindOverflowScrollParent.mockImplementationOnce(() => scrollContainer);
    const mockBlockCardPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockBlockCardNode = mount(
      <BlockCardComponent
        node={mockBlockCardPmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
      />,
    );
    const wrapper = mockBlockCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(scrollContainer);
    mockBlockCardNode.unmount();
  });

  it('should call registerCard when URL renders', () => {
    const mockBlockPmNode = blockCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockBlockCardNode = mount(
      <BlockCardComponent
        node={mockBlockPmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
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
    mockBlockCardNode.unmount();
  });
});
