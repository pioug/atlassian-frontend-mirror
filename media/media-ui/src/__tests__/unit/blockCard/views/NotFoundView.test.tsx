import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '../../../__utils__/render';
import { BlockCardNotFoundView } from '../../../../BlockCard';
import { getResolvedProps } from '../../../__mocks__/get-resolved-props';
import { ResolvedViewProps } from '../../../../BlockCard/views/ResolvedView';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('Block card views - Not Found', () => {
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
      <BlockCardNotFoundView {...props} testId="not-found-view" />,
    );
    const frame = getByTestId('not-found-view');
    expect(frame.textContent).toMatch(
      /https:\/\/github.com\/changesets\/changesetsWe couldn't find the link. Check the url and try editing or paste again./,
    );
    const icon = getByTestId('not-found-view-warning-icon');
    expect(icon.getAttribute('aria-label')).toBe('not-found-warning-icon');
  });

  it('clicking on link should have no side-effects', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardNotFoundView {...props} testId="not-found-view" />,
    );
    const view = getByTestId('not-found-view');
    const link = view.querySelector('a');

    expect(link).toBeTruthy();
    fireEvent.click(link!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
