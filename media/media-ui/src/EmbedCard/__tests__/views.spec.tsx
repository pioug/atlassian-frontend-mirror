import React from 'react';
import { render, cleanup } from '@testing-library/react';
import {
  EmbedCardResolvedViewProps,
  EmbedCardResolvedView,
} from '../views/ResolvedView';
import { BlockCardResolvingView } from '../../BlockCard';
import { EmbedCardUnauthorisedView } from '../views/UnauthorisedView';
import { EmbedCardForbiddenView } from '../views/ForbiddenView';
import { EmbedCardNotFoundView } from '../views/NotFoundView';

const getResolvedProps = (overrides = {}): EmbedCardResolvedViewProps => ({
  link:
    'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
  preview:
    'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
  title: 'Smart Link Assets',
  context: {
    text: 'Dropbox',
    icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
  },
  ...overrides,
});

describe('EmbedCard Views', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('view: resolved', () => {
    it('renders view', () => {
      const props = getResolvedProps();
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="resolved-view" {...props} />,
      );
      const outerFrame = getByTestId('resolved-view');
      const innerFrame = getByTestId('resolved-view-frame');
      expect(outerFrame.textContent).toBe('Dropbox');
      expect(innerFrame).toBeTruthy();
      expect(innerFrame.getAttribute('src')).toBe(props.preview);
    });
  });

  // Same as BlockCard
  describe('view: resolving', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardResolvingView testId="resolving-view" />,
      );
      const frame = getByTestId('resolving-view');
      expect(frame.textContent).toBe('Loading...');
    });
  });

  describe('view: unauthorised', () => {
    it('renders view', () => {
      const { getByTestId, getByText } = render(
        <EmbedCardUnauthorisedView link="" />,
      );
      const view = getByTestId('embed-unauthorised-view');
      const message = getByText(/Connect your.*account/);

      expect(view).toBeTruthy();
      expect(message).toBeTruthy();
    });
  });

  describe('view: forbidden', () => {
    it('renders view', () => {
      const { getByTestId, getByText } = render(
        <EmbedCardForbiddenView link="" />,
      );
      const button = getByTestId('embed-forbidden-view-button');
      const message = getByText('You don’t have access to this link');

      expect(button.textContent).toEqual('Try another account');
      expect(button).toBeTruthy();
      expect(message).toBeTruthy();
    });
  });

  describe('view: not found', () => {
    it('renders view', () => {
      const { getByText } = render(<EmbedCardNotFoundView link="" />);
      const message = getByText("Uh oh. We can't find this link!");

      expect(message).toBeTruthy();
    });
  });
});
