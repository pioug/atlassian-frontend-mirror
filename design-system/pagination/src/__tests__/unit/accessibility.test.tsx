import React from 'react';

import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/standard-button';

import Pagination, { PaginationPropTypes } from '../../index';

function assertPageButtonRendering(
  view: RenderResult,
  { page, isSelected }: { page: string; isSelected: boolean },
) {
  try {
    const pageElement = screen.getByRole('button', { name: `page ${page}` });

    expect(pageElement).toBeInTheDocument();

    if (isSelected) {
      expect(pageElement).toHaveAttribute('aria-current', 'page');
    } else {
      expect(pageElement).not.toHaveAttribute('aria-current', 'page');
    }
  } catch (error: any) {
    Error.captureStackTrace(error, assertPageButtonRendering);

    throw error;
  }
}

function assertNavigationButtonRendering(
  view: RenderResult,
  { label, isEnabled }: { label: string; isEnabled: boolean },
) {
  try {
    const navigationButton = screen.getByLabelText(label);

    expect(navigationButton).toBeInTheDocument();

    if (isEnabled) {
      expect(navigationButton).toBeEnabled();
      expect(navigationButton).toHaveStyle('cursor: pointer');
    } else {
      expect(navigationButton).toBeDisabled();
      expect(navigationButton).toHaveStyle('cursor: not-allowed');
    }
  } catch (error: any) {
    Error.captureStackTrace(error, assertNavigationButtonRendering);

    throw error;
  }
}

describe('Pagination Accessibility', () => {
  const setup = <T extends any = number>(
    paginationProps: Partial<PaginationPropTypes<T>> = {},
  ) => {
    const props = {
      pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as T[],
      testId: 'pagination',
    };

    const view = render(<Pagination<T> {...props} {...paginationProps} />);

    return {
      view,
      props,
    };
  };

  const ellipsisButton = ({ key }: { key: string }) => {
    return (
      <Button
        onClick={() => jest.fn()}
        appearance="subtle"
        key={key}
        aria-label="expand"
      >
        &hellip;
      </Button>
    );
  };

  it('Basic pagination should pass basic aXe audit', async () => {
    setup();

    const container = screen.getByTestId('pagination');
    await axe(container);
  });

  it('With previous button disabled, should pass basic aXe audit', async () => {
    const { view } = setup();
    assertNavigationButtonRendering(view, {
      label: 'previous',
      isEnabled: false,
    });

    const container = screen.getByTestId('pagination');
    await axe(container);
  });

  it('With next button disabled, should pass basic aXe audit', async () => {
    const onChange = jest.fn();
    setup({ onChange });
    fireEvent.click(screen.getByTestId('pagination--page-9'));

    const container = screen.getByTestId('pagination');
    await axe(container);
  });

  it('Basic ellipsis should pass basic aXe audit', async () => {
    const onChange = jest.fn();
    const { view } = setup({ onChange });
    fireEvent.click(screen.getByTestId('pagination--page-3'));

    [
      { page: '1', isSelected: false },
      { page: '2', isSelected: false },
      { page: '3', isSelected: false },
      { page: '4', isSelected: true },
      { page: '5', isSelected: false },
      { page: '10', isSelected: false },
    ].forEach(({ page, isSelected }) => {
      assertPageButtonRendering(view, { page, isSelected });
    });

    const container = screen.getByTestId('pagination');
    await axe(container);
  });

  it('Custom ellipsis should pass basic aXe audit', async () => {
    setup({
      renderEllipsis: ellipsisButton,
    });

    const container = screen.getByTestId('pagination');
    await axe(container);
  });
});
