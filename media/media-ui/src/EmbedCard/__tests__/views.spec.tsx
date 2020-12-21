import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import {
  EmbedCardResolvedViewProps,
  EmbedCardResolvedView,
} from '../views/ResolvedView';
import { BlockCardResolvingView } from '../../BlockCard';
import { EmbedCardUnauthorisedView } from '../views/UnauthorisedView';
import { EmbedCardForbiddenView } from '../views/ForbiddenView';
import { EmbedCardNotFoundView } from '../views/NotFoundView';
import { ErroredView } from '../views/ErroredView';

let mockOnClick: React.MouseEventHandler = jest.fn();
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
  onClick: mockOnClick,
  ...overrides,
});

describe('EmbedCard Views', () => {
  beforeEach(() => {
    mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
      expect(event.isPropagationStopped()).toBe(true);
      expect(event.isDefaultPrevented()).toBe(true);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('view: resolved', () => {
    it('renders view', () => {
      const props = getResolvedProps();
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const outerFrame = getByTestId('embed-card-resolved-view');
      const innerFrame = getByTestId('embed-card-resolved-view-frame');
      expect(outerFrame.textContent).toBe('Smart Link Assets');
      expect(innerFrame).toBeTruthy();
      expect(innerFrame.getAttribute('src')).toBe(props.preview);
    });

    it('should default to context text if title is missing', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const outerFrame = getByTestId('embed-card-resolved-view');

      expect(outerFrame.textContent).toBe('Dropbox');
    });

    it('clicking on link should have no side-effects', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const view = getByTestId('embed-card-resolved-view');
      const link = view.querySelector('a');

      expect(link).toBeTruthy();
      fireEvent.click(link!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should pass iframe forward ref down to <iframe> element', async () => {
      const props = getResolvedProps();
      const ref = React.createRef<HTMLIFrameElement>();
      const { container } = render(
        <EmbedCardResolvedView
          testId="embed-card-resolved-view"
          {...props}
          ref={ref}
        />,
      );
      const iframeEl = await container.querySelector('iframe');
      expect(iframeEl).toBe(ref.current);
    });
  });

  // Same as BlockCard
  describe('view: resolving', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardResolvingView testId="embed-card-resolving-view" />,
      );
      const frame = getByTestId('embed-card-resolving-view');
      expect(frame.textContent).toBe('Loading...');
    });
  });

  describe('view: unauthorised', () => {
    it('renders view', () => {
      const { getByTestId, getByText } = render(
        <EmbedCardUnauthorisedView link="" />,
      );
      const view = getByTestId('embed-card-unauthorized-view');
      const message = getByText(/Connect your.*account/);

      expect(view).toBeTruthy();
      expect(message).toBeTruthy();
    });

    it('clicking on link should have no side-effects', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(<EmbedCardUnauthorisedView {...props} />);
      const view = getByTestId('embed-card-unauthorized-view');
      const link = view.querySelector('a');

      expect(link).toBeTruthy();
      fireEvent.click(link!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('view: forbidden', () => {
    it('renders view', () => {
      const { getByTestId, getByText } = render(
        <EmbedCardForbiddenView link="" />,
      );
      const button = getByTestId('button-connect-other-account');
      const message = getByText('Restricted link');

      expect(button.textContent).toEqual('Try another account');
      expect(button).toBeTruthy();
      expect(message).toBeTruthy();
    });

    it('clicking on link should have no side-effects', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(<EmbedCardForbiddenView {...props} />);
      const view = getByTestId('embed-card-forbidden-view');
      const link = view.querySelector('a');

      expect(link).toBeTruthy();
      fireEvent.click(link!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('view: not found', () => {
    it('renders view', () => {
      const { getByText } = render(<EmbedCardNotFoundView link="" />);
      const message = getByText("Uh oh. We can't find this link!");

      expect(message).toBeTruthy();
    });

    it('clicking on link should have no side-effects', () => {
      const props = getResolvedProps({ title: undefined });
      const { getByTestId } = render(<EmbedCardNotFoundView {...props} />);
      const view = getByTestId('embed-card-not-found-view');
      const link = view.querySelector('a');

      expect(link).toBeTruthy();
      fireEvent.click(link!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('view: errored', () => {
    it('renders view', () => {
      const { getByTestId } = render(<ErroredView testId="errored-view" />);
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for an unknown reason.Try again",
      );
    });

    it('renders view - clicking on retry enacts callback', () => {
      const onRetryMock = jest.fn();
      const { getByTestId } = render(
        <ErroredView testId="errored-view" onRetry={onRetryMock} />,
      );
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for an unknown reason.Try again",
      );

      // Check the button is there
      const button = getByTestId('err-view-retry');
      expect(button.textContent).toBe('Try again');

      // Click it, check mock is called
      fireEvent.click(button);
      expect(onRetryMock).toHaveBeenCalled();
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });
});
