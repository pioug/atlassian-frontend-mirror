import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '../../../__utils__/render';
import { BlockCardForbiddenView } from '../../../../BlockCard';
import { ResolvedViewProps } from '../../../../BlockCard/views/ResolvedView';
import { getResolvedProps } from '../../../__mocks__/get-resolved-props';

let mockOnClick: React.MouseEventHandler = jest.fn();
describe('Block card views - Forbidden', () => {
  let props: ResolvedViewProps;

  beforeEach(() => {
    mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
      expect(event.isPropagationStopped()).toBe(true);
      expect(event.isDefaultPrevented()).toBe(true);
    });
    props = getResolvedProps({}, mockOnClick);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders view', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardForbiddenView {...props} testId="forbidden-view" />,
    );
    const frame = getByTestId('forbidden-view');
    expect(frame.textContent).toMatch(
      /https:\/\/github.com\/changesets\/changesetsYou'll need to request access or try a different account to view this preview./,
    );
    const icon = getByTestId('forbidden-view-lock-icon');
    expect(icon.getAttribute('aria-label')).toBe('forbidden-lock-icon');
  });

  it('clicking on link should have no side-effects', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardForbiddenView {...props} testId="forbidden-view" />,
    );
    const view = getByTestId('forbidden-view');
    const link = view.querySelector('a');

    expect(link).toBeTruthy();
    fireEvent.click(link!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show correct text if request access type is DIRECT_ACCESS', () => {
    const mockOnClick = jest.fn();
    const requestAccessContext = {
      descriptiveMessageKey: 'click_to_join_description',
      action: {
        promise: () => new Promise((resolve) => resolve(mockOnClick())),
        id: 'click_to_join',
        text: 'Join to preview',
      },
    };
    const { queryByText } = renderWithIntl(
      <BlockCardForbiddenView
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
    const mockOnClick = jest.fn();
    const requestAccessContext = {
      descriptiveMessageKey: 'click_to_join_description',
      action: {
        promise: () => new Promise((resolve) => resolve(mockOnClick())),
        id: 'click_to_join',
        text: 'Join Jira',
      },
    };
    const { queryByText } = renderWithIntl(
      <BlockCardForbiddenView
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
    const mockOnClick = jest.fn();
    const requestAccessContext = {
      descriptiveMessageKey: 'request_access_description',
      action: {
        promise: () => new Promise((resolve) => resolve(mockOnClick())),
        id: 'request_access',
        text: 'Request access to preview',
      },
    };
    const { queryByText } = renderWithIntl(
      <BlockCardForbiddenView
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
    const mockOnClick = jest.fn();
    const requestAccessContext = {
      descriptiveMessageKey: 'request_access_description',
      action: {
        promise: () => new Promise((resolve) => resolve(mockOnClick())),
        id: 'request_access',
        text: 'Request access',
      },
    };
    const { queryByText } = renderWithIntl(
      <BlockCardForbiddenView
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
    const requestAccessContext = {
      descriptiveMessageKey: 'request_access_pending_description',
    };
    const { queryByText } = renderWithIntl(
      <BlockCardForbiddenView
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
    const requestAccessContext = {
      descriptiveMessageKey: 'request_access_description',
    };
    const { container } = renderWithIntl(
      <BlockCardForbiddenView
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
      <BlockCardForbiddenView
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
      <BlockCardForbiddenView
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
      <BlockCardForbiddenView
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
      <BlockCardForbiddenView
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
