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
import { renderWithIntl } from '../../__tests__/__utils__/render';

let mockOnClick: React.MouseEventHandler = jest.fn();
const getResolvedProps = (overrides = {}): EmbedCardResolvedViewProps => ({
  link:
    'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
  preview: {
    src:
      'https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0',
    aspectRatio: 0.6,
  },
  title: 'Smart Link Assets',
  context: {
    text: 'Dropbox',
    icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
  },
  isTrusted: true,
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
      expect(innerFrame.getAttribute('src')).toBe(props.preview?.src);
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

    it('renders sandbox prop on <iframe> element on untrusted link', async () => {
      const props = getResolvedProps({ isTrusted: false });
      const { container } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const iframeEl = await container.querySelector('iframe');
      expect(iframeEl?.getAttribute('sandbox')).toBe(
        'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts',
      );
    });

    it('does not renders sandbox prop on <iframe> element on trusted link', async () => {
      const props = getResolvedProps({ isTrusted: true });
      const { container } = render(
        <EmbedCardResolvedView testId="embed-card-resolved-view" {...props} />,
      );
      const iframeEl = await container.querySelector('iframe');
      expect(iframeEl?.getAttribute('sandbox')).toBeNull();
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

    it('should show correct text if request access type is DIRECT_ACCESS', () => {
      const props = getResolvedProps();
      const mockOnClick = jest.fn();
      const requestAccessContext = {
        descriptiveMessageKey: 'click_to_join_description',
        callToActionMessageKey: 'click_to_join',
        action: {
          promise: () => new Promise((resolve) => resolve(mockOnClick())),
          id: 'click_to_join',
          text: 'Join to preview',
        },
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const span = queryByText(
        "You've been approved, so you can join Jira right away.",
      );
      expect(span).not.toBeNull();
    });

    it('should show correct button text and have action if request access type is DIRECT_ACCESS', () => {
      const props = getResolvedProps();
      const mockOnClick = jest.fn();
      const requestAccessContext = {
        descriptiveMessageKey: 'click_to_join_description',
        callToActionMessageKey: 'click_to_join',
        action: {
          promise: () => new Promise((resolve) => resolve(mockOnClick())),
          id: 'click_to_join',
          text: 'Join Jira',
        },
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const button = queryByText('Join Jira');
      expect(button).not.toBeNull();
      fireEvent.click(button!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should show correct text if request access type is REQUEST_ACCESS', () => {
      const props = getResolvedProps();
      const mockOnClick = jest.fn();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_access_description',
        callToActionMessageKey: 'request_access',
        action: {
          promise: () => new Promise((resolve) => resolve(mockOnClick())),
          id: 'request_access',
          text: 'Request access',
        },
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const span = queryByText('Request access to Jira view this preview.');
      expect(span).not.toBeNull();
    });

    it('should show correct button text and have action if request access type is REQUEST_ACCESS', () => {
      const props = getResolvedProps();
      const mockOnClick = jest.fn();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_access_description',
        callToActionMessageKey: 'request_access',
        action: {
          promise: () => new Promise((resolve) => resolve(mockOnClick())),
          id: 'request_access',
          text: 'Request access',
        },
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const button = queryByText('Request access');
      expect(button).not.toBeNull();
      fireEvent.click(button!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should show correct text if request access type is PENDING_REQUEST_EXISTS', () => {
      const props = getResolvedProps();
      const mockOnClick = jest.fn();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_access_pending_description',
        callToActionMessageKey: 'request_access_pending',
        action: {
          promise: () => new Promise((resolve) => resolve(mockOnClick())),
          id: 'request_access_pending',
          text: 'Access pending',
        },
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const span = queryByText('Your access request is pending.');
      expect(span).not.toBeNull();
    });

    it('should not show pending request button text if request access type is PENDING_REQUEST_EXISTS', () => {
      const props = getResolvedProps();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_access_description',
      };
      const { container } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const button = container.querySelector('[type="button"]');
      expect(button).toBeNull();
    });

    it('should show correct text if request access type is FORBIDDEN', () => {
      const props = getResolvedProps();
      const requestAccessContext = {
        descriptiveMessageKey: 'forbidden_description',
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const span = queryByText(
        'You don’t have access to this preview. Contact the site admin if you need access.',
      );
      expect(span).not.toBeNull();
    });

    it('should not show forbidden button text if request access type is FORBIDDEN', () => {
      const props = getResolvedProps();
      const requestAccessContext = {
        descriptiveMessageKey: 'forbidden_description',
      };
      const { container } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const button = container.querySelector('[type="button"]');
      expect(button).toBeNull();
    });

    it('should show correct text if request access type is DENIED_REQUEST_EXISTS', () => {
      const props = getResolvedProps();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_denied_description',
      };
      const { queryByText } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const span = queryByText(
        'Your access request was denied. Contact the site admin if you still need access.',
      );
      expect(span).not.toBeNull();
    });

    it('should not show request denied button text if request access type is DENIED_REQUEST_EXISTS', () => {
      const props = getResolvedProps();
      const requestAccessContext = {
        descriptiveMessageKey: 'request_denied_description',
      };
      const { container } = renderWithIntl(
        <EmbedCardForbiddenView
          {...props}
          requestAccessContext={requestAccessContext as any}
          context={{ text: 'Jira' }}
          testId="forbidden-view"
        />,
      );
      const button = container.querySelector('[type="button"]');
      expect(button).toBeNull();
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
