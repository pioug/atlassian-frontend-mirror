import React from 'react';
import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import { renderWithIntl } from '../../../__utils__/render';
import { BlockCardUnauthorisedView } from '../../../../BlockCard';
import {
  getResolvedProps,
  mockUrl,
} from '../../../__mocks__/get-resolved-props';
import { ResolvedViewProps } from '../../../../BlockCard/views/ResolvedView';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('BlockCard Views - Unauthorised', () => {
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
      <BlockCardUnauthorisedView
        {...props}
        context={{ text: 'cool theatre stuff' }}
        testId="unauthorised-view"
        actions={[]}
      />,
    );
    const nameFrame = getByTestId('unauthorised-view-link');
    expect(nameFrame.textContent).toBe(mockUrl);
    const byline = getByTestId('unauthorised-view-byline');
    expect(byline.textContent).toBe(
      `To show a preview of this link, connect your cool theatre stuff account.`,
    );
  });

  it('renders view with actions', () => {
    const { getByText } = renderWithIntl(
      <BlockCardUnauthorisedView
        {...props}
        context={{ text: 'not allowed to view' }}
        testId="unauthorised-view"
        actions={[
          {
            id: 'test-button',
            text: 'One of a kind',
            promise: () => Promise.resolve('historemix'),
          },
        ]}
      />,
    );
    expect(getByText('One of a kind')).toBeInTheDocument();
  });

  it('renders view with actions - reacts to click on action', async () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardUnauthorisedView
        {...props}
        context={{ text: 'not allowed to view' }}
        testId="unauthorised-view"
        actions={[
          {
            id: 'test-button',
            text: 'One of a kind',
            promise: () => Promise.resolve('historemix'),
          },
        ]}
      />,
    );
    // Check button is there
    const button = getByTestId('button-test-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('One of a kind');

    // Click button, expecting it to succeed.
    fireEvent.click(button);
    const checkIcon = await waitForElement(() => getByTestId('check-icon'));
    expect(checkIcon).toBeInTheDocument();
  });

  it('does not render actinos when showActions -> false', async () => {
    const { queryByTestId } = renderWithIntl(
      <BlockCardUnauthorisedView
        {...props}
        context={{ text: 'not allowed to view' }}
        testId="unauthorised-view"
        showActions={false}
        actions={[
          {
            id: 'test-button',
            text: 'One of a kind',
            promise: () => Promise.resolve('historemix'),
          },
        ]}
      />,
    );

    // Check button is not there
    expect(queryByTestId('button-test-button')).toBeNull();
  });

  it('clicking on link should have no side-effects', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardUnauthorisedView
        {...props}
        testId="unauthorised-view"
        actions={[]}
      />,
    );
    const view = getByTestId('unauthorised-view');
    const link = view.querySelector('a');

    expect(link).toBeTruthy();
    fireEvent.click(link!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
