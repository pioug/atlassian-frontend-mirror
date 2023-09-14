jest.mock('../../../pm-plugins/doc');
import React from 'react';

import { render } from '@testing-library/react';

import type { Command } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import { APIError } from '@atlaskit/smart-card';

import { changeSelectedCardToLinkFallback } from '../../../pm-plugins/doc';
import { Card } from '../../genericCard';

describe('<GenericCard/>', () => {
  let mockEditorView: EditorView;
  const mockChangeSelectedCardToLink = asMockFunction(
    changeSelectedCardToLinkFallback,
  );
  let commandMock: jest.Mock<ReturnType<Command>, Parameters<Command>>;

  beforeEach(() => {
    mockEditorView = {
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
    } as unknown as EditorView;
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

    render(
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

    render(
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
      undefined,
    ]);
    expectFunctionToHaveBeenCalledWith(commandMock, [
      mockEditorView.state,
      mockEditorView.dispatch,
    ]);
  });

  it('should pass showServerActions to component', () => {
    const logShowServerActions = jest.fn();
    const SmartCardComponent = ({ showServerActions }: any) => {
      logShowServerActions(showServerActions);
      return <span></span>;
    };

    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const WrappedCard = Card(SmartCardComponent, () => {
      return null;
    });
    render(
      <WrappedCard
        node={mockInlinePmNode}
        view={mockEditorView}
        getPos={() => 0}
        showServerActions={true}
      />,
    );
    expect(logShowServerActions).toHaveBeenCalledWith(true);
  });
});
