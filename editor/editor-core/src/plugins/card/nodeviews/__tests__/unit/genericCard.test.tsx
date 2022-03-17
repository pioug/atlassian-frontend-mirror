jest.mock('../../../pm-plugins/doc');
import React from 'react';
import { Card } from '../../genericCard';
import {
  embedCard,
  inlineCard,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { APIError } from '@atlaskit/smart-card';
import { changeSelectedCardToLinkFallback } from '../../../pm-plugins/doc';
import { Command } from '../../../../../types/command';
import {
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import { EditorState } from 'prosemirror-state';

import { EmbedCardAttributes } from '@atlaskit/adf-schema';

describe('<GenericCard/>', () => {
  let mockEditorView: EditorView;
  const mockChangeSelectedCardToLink = asMockFunction(
    changeSelectedCardToLinkFallback,
  );
  let commandMock: jest.Mock<ReturnType<Command>, Parameters<Command>>;

  beforeEach(() => {
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
    commandMock = jest.fn((state: EditorState) => true);
    mockChangeSelectedCardToLink.mockReturnValue(commandMock);
  });

  it('should not call changeSelectedCardToLinkFallback when we do not get a fatal error', () => {
    const ThrowingComponent = () => {
      throw new APIError('auth', 'blah', 'blah');
    };

    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const WrappedCard = Card(ThrowingComponent, () => {
      return null;
    });

    mount(
      <WrappedCard
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );
    expect(changeSelectedCardToLinkFallback).not.toHaveBeenCalled();
  });

  it('should call changeSelectedCardToLink when we get a fatal error', () => {
    const ThrowingComponent = () => {
      throw new APIError('fatal', 'blah', 'blah');
    };

    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const WrappedCard = Card(ThrowingComponent, () => {
      return null;
    });

    mount(
      <WrappedCard
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );
    expectFunctionToHaveBeenCalledWith(mockChangeSelectedCardToLink, [
      undefined,
      'https://some/url',
      true,
      mockInlinePmNode,
      0,
    ]);
    expectFunctionToHaveBeenCalledWith(commandMock, [
      mockEditorView.state,
      mockEditorView.dispatch,
    ]);
  });

  it('assigns url as react key', () => {
    const url = 'https://some/url';
    const MockComponent = () => <div />;
    const mockEmbedPmNode = embedCard({
      url,
    } as EmbedCardAttributes)()(defaultSchema);
    const WrappedCard = Card(MockComponent, () => {
      return null;
    });

    const wrap = mount(
      <WrappedCard
        node={mockEmbedPmNode}
        view={mockEditorView}
        getPos={() => 0}
      />,
    );

    expect(wrap.childAt(0).key()).toEqual(url);
  });
});
