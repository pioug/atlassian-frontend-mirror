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
});
