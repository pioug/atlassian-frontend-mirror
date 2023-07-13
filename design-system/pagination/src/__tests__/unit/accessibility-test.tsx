import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';

import {
  axe,
  jestAxeConfig,
  toHaveNoViolations,
} from '@af/accessibility-testing';
import Button from '@atlaskit/button/standard-button';

import Pagination, { PaginationPropTypes } from '../../index';

expect.extend(toHaveNoViolations);

function assertPageButtonRendering(
  renderResult: RenderResult,
  { page, isSelected }: { page: string; isSelected: boolean },
) {
  try {
    const pageElement = renderResult.getByText(page).parentElement;

    expect(pageElement).toBeInTheDocument();

    if (isSelected) {
      expect(pageElement).toHaveAttribute(
        'data-testId',
        expect.stringContaining(`pagination--current-page`),
      );
    } else {
      expect(pageElement).toHaveAttribute(
        'data-testId',
        expect.stringContaining(`pagination--page`),
      );
    }
  } catch (error: any) {
    Error.captureStackTrace(error, assertPageButtonRendering);

    throw error;
  }
}

function assertNavigationButtonRendering(
  renderResult: RenderResult,
  { label, isEnabled }: { label: string; isEnabled: boolean },
) {
  try {
    const navigationButton = renderResult.getByLabelText(label);

    expect(navigationButton).toBeInTheDocument();

    if (isEnabled) {
      expect(navigationButton).not.toHaveAttribute('disabled');
      expect(navigationButton).toHaveStyle('cursor: pointer');
    } else {
      expect(navigationButton).toHaveAttribute('disabled');
      expect(navigationButton).toHaveStyle('cursor: not-allowed');
    }
  } catch (error: any) {
    Error.captureStackTrace(error, assertNavigationButtonRendering);

    throw error;
  }
}

describe('Pagination Accessibility', () => {
  afterEach(cleanup);

  const setup = <T extends any = number>(
    paginationProps: Partial<PaginationPropTypes<T>> = {},
  ) => {
    const props = {
      pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as T[],
      testId: 'pagination',
    };

    const renderResult = render(
      <Pagination<T> {...props} {...paginationProps} />,
    );

    return {
      renderResult,
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
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('With previous button disabled, should pass basic aXe audit', async () => {
    const { renderResult } = setup();
    assertNavigationButtonRendering(renderResult, {
      label: 'previous',
      isEnabled: false,
    });

    const container = screen.getByTestId('pagination');
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('With next button disabled, should pass basic aXe audit', async () => {
    const onChange = jest.fn();
    const { renderResult } = setup({ onChange });
    fireEvent.click(renderResult.getByTestId('pagination--page-9'));

    const container = screen.getByTestId('pagination');
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Basic ellipsis should pass basic aXe audit', async () => {
    const onChange = jest.fn();
    const { renderResult } = setup({ onChange });
    fireEvent.click(renderResult.getByTestId('pagination--page-3'));

    [
      { page: '1', isSelected: false },
      { page: '2', isSelected: false },
      { page: '3', isSelected: false },
      { page: '4', isSelected: true },
      { page: '5', isSelected: false },
      { page: '10', isSelected: false },
    ].forEach(({ page, isSelected }) => {
      assertPageButtonRendering(renderResult, { page, isSelected });
    });

    const container = screen.getByTestId('pagination');
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });

  it('Custom ellipsis should pass basic aXe audit', async () => {
    setup({
      renderEllipsis: ellipsisButton,
    });

    const container = screen.getByTestId('pagination');
    const results = await axe(container, jestAxeConfig);
    expect(results).toHaveNoViolations();
  });
});
