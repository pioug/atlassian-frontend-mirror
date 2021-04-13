jest.mock('../../../pm-plugins/doc');
import React from 'react';
import { Card } from '../../genericCard';
import { inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { APIError } from '@atlaskit/smart-card';
import { changeSelectedCardToLink } from '../../../pm-plugins/doc';
import { Command } from '../../../../../types/command';
import {
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import { EditorState } from 'prosemirror-state';

describe('<GenericCard/>', () => {
  let mockEditorView: EditorView;
  const mockChangeSelectedCardToLink = asMockFunction(changeSelectedCardToLink);
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

  it('should not call changeSelectedCardToLink when we do not get a fatal error', () => {
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
    expect(changeSelectedCardToLink).not.toHaveBeenCalled();
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
});
