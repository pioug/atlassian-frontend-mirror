import React, { forwardRef } from 'react';

import {
  fireEvent,
  render,
  type RenderResult,
  screen,
} from '@testing-library/react';

import Pagination, { type PaginationPropTypes } from '../../index';

const ellipsis = '\u2026';

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

describe('Pagination', () => {
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

  describe('rendering with default props', () => {
    it('should not throw error while rendering', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });

    it('should render 1, 2, 3, 4, 5 and 10th pages only along with ellipsis (max 7 pages) and 1st page as selected', () => {
      const { view } = setup();

      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
        { page: '3', isSelected: false },
        { page: '4', isSelected: false },
        { page: '5', isSelected: false },
        { page: '10', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });

      expect(screen.getByText('\u2026')).toBeInTheDocument();

      ['6', '7', '8', '9'].forEach((page) => {
        expect(screen.queryByText(page)).not.toBeInTheDocument();
      });
    });

    it('should render with an aria-label attribute', () => {
      const { view } = setup();
      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
        { page: '5', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
        expect(
          screen.getByLabelText(`page ${page}`, { selector: 'button' }),
        ).toBeInTheDocument();
      });
    });
    it('should render aria-current on selected page', () => {
      const { view } = setup();
      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
        { page: '3', isSelected: false },
        { page: '4', isSelected: false },
        { page: '5', isSelected: false },
        { page: '10', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });

      expect(
        screen.getByRole('button', { current: 'page' }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { current: 'page' }),
      ).toHaveAccessibleName('page 1');
    });

    it('should render previous and next navigation buttons', () => {
      const { view } = setup();

      assertNavigationButtonRendering(view, {
        label: 'previous',
        isEnabled: false,
      });

      assertNavigationButtonRendering(view, {
        label: 'next',
        isEnabled: true,
      });
    });
    it('should have a nav tag', () => {
      setup({ testId: 'test' });
      const pagination = screen.getByTestId('test');

      expect(pagination).toBeInTheDocument();
      expect(pagination.tagName).toBe('NAV');
    });
  });

  describe('props', () => {
    describe('#components', () => {
      it('should render custom components', () => {
        function Page(
          { page, ...rest }: { page: number },
          ref: React.Ref<HTMLDivElement>,
        ) {
          return (
            // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
            <div ref={ref} {...rest} data-testid={`Page-${page}`}>
              Page - {page}
            </div>
          );
        }
        function Navigation(
          props: { 'aria-label': string },
          ref: React.Ref<HTMLDivElement>,
        ) {
          return (
            <div
              ref={ref}
              // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
              {...props}
              data-testid={`custom-${props['aria-label']}`}
            >
              {props['aria-label']}
            </div>
          );
        }
        const { view, props } = setup({
          components: {
            Previous: forwardRef(Navigation),
            Page: forwardRef(Page),
            Next: forwardRef(Navigation),
          },
        });

        expect(screen.getByTestId('Page-1')).toBeInTheDocument();
        expect(screen.getByTestId('custom-previous')).toBeInTheDocument();
        expect(screen.getByTestId('custom-next')).toBeInTheDocument();

        view.rerender(<Pagination {...props} components={{}} />);

        expect(screen.queryByTestId('Page-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('custom-previous')).not.toBeInTheDocument();
        expect(screen.queryByTestId('custom-next')).not.toBeInTheDocument();
      });
    });

    describe('#getPageLabel', () => {
      it('should render custom page labels', () => {
        const pages = [{ label: '1' }, { label: '2' }];
        const getPageLabel = (page: { label: string }, index: number) =>
          `${page.label}-${index}`;
        const { view, props } = setup({ pages, getPageLabel });

        [
          { page: '1-0', isSelected: true },
          { page: '2-1', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        const newGetPageLabel = (page: { label: string }, index: number) =>
          `${page.label}---${index}`;
        view.rerender(
          <Pagination
            {...props}
            pages={pages}
            getPageLabel={newGetPageLabel}
          />,
        );

        [
          { page: '1---0', isSelected: true },
          { page: '2---1', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });
      });
    });

    describe('aria-labels', () => {
      it('should apply different labels to navigation buttons', () => {
        const { view, props } = setup({
          label: 'pagination',
          previousLabel: 'p',
          nextLabel: 'n',
        });

        assertNavigationButtonRendering(view, {
          label: 'p',
          isEnabled: false,
        });
        assertNavigationButtonRendering(view, {
          label: 'n',
          isEnabled: true,
        });

        view.rerender(
          <Pagination
            {...props}
            label="pagination"
            previousLabel="pr"
            nextLabel="ne"
          />,
        );

        assertNavigationButtonRendering(view, {
          label: 'pr',
          isEnabled: false,
        });
        assertNavigationButtonRendering(view, {
          label: 'ne',
          isEnabled: true,
        });
      });
    });

    describe('#style', () => {
      it('should apply style to container', () => {
        const { view, props } = setup({
          style: { border: '1px solid red' },
        });

        expect(
          screen.getByRole('navigation', { name: 'pagination' }),
        ).toHaveStyle('border: 1px solid red');

// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        view.rerender(<Pagination {...props} style={{ top: '50px' }} />);

        expect(
          screen.getByRole('navigation', { name: 'pagination' }),
        ).not.toHaveStyle('border: 1px solid red');
        expect(
          screen.getByRole('navigation', { name: 'pagination' }),
        ).toHaveStyle('top: 50px');
      });
    });

    describe('#max', () => {
      it('should hide pages when count is decreased', () => {
        const { view, props } = setup({ max: 10 });

        [
          { page: '1', isSelected: true },
          { page: '2', isSelected: false },
          { page: '3', isSelected: false },
          { page: '4', isSelected: false },
          { page: '5', isSelected: false },
          { page: '6', isSelected: false },
          { page: '7', isSelected: false },
          { page: '8', isSelected: false },
          { page: '9', isSelected: false },
          { page: '10', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        expect(screen.queryByText(ellipsis)).not.toBeInTheDocument();

        view.rerender(<Pagination {...props} max={8} />);

        [
          { page: '1', isSelected: true },
          { page: '2', isSelected: false },
          { page: '3', isSelected: false },
          { page: '4', isSelected: false },
          { page: '5', isSelected: false },
          { page: '6', isSelected: false },
          { page: '10', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        expect(screen.getByText(ellipsis)).toBeInTheDocument();

        ['7', '8', '9'].forEach((page) => {
          expect(screen.queryByText(page)).not.toBeInTheDocument();
        });
      });
    });

    describe('#onChange', () => {
      it('should get called with new selected index when page is changed', () => {
        const onChange = jest.fn();
        const { view, props } = setup({ onChange });

        fireEvent.click(screen.getByText('2'));

        expect(onChange.mock.calls[0][1]).toBe(2);

        const newOnChange = jest.fn();
        view.rerender(<Pagination {...props} onChange={newOnChange} />);

        fireEvent.click(screen.getByText('4'));

        expect(newOnChange.mock.calls[0][1]).toBe(4);
      });
    });

    describe('#defaultSelectedIndex', () => {
      it('should not change when re-rendered', () => {
        const { view, props } = setup({ defaultSelectedIndex: 1 });

        [{ page: '2', isSelected: true }].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        view.rerender(<Pagination {...props} defaultSelectedIndex={3} />);

        [
          { page: '2', isSelected: true },
          { page: '4', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });
      });
    });

    describe('#selectedIndex', () => {
      it('should change when re-rendered', () => {
        const { view, props } = setup({ selectedIndex: 1 });

        [{ page: '2', isSelected: true }].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        view.rerender(<Pagination {...props} selectedIndex={3} />);

        [
          { page: '2', isSelected: false },
          { page: '4', isSelected: true },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });
      });
    });

    describe('#pages', () => {
      it('should re-render with new pages', () => {
        const { view, props } = setup({ pages: [1, 2, 3] });

        [
          { page: '1', isSelected: true },
          { page: '2', isSelected: false },
          { page: '3', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });

        expect(screen.queryByText('4')).not.toBeInTheDocument();

        view.rerender(<Pagination {...props} pages={[1, 2, 3, 4]} />);

        [
          { page: '1', isSelected: true },
          { page: '2', isSelected: false },
          { page: '3', isSelected: false },
          { page: '4', isSelected: false },
        ].forEach(({ page, isSelected }) => {
          assertPageButtonRendering(view, { page, isSelected });
        });
      });
    });

    describe('#renderEllipsis', () => {
      it('should re-render with new ellipsis', () => {
        const { view, props } = setup({
          renderEllipsis: jest.fn().mockReturnValue('\u2026E\u2026'),
        });

        expect(screen.getByText('\u2026E\u2026')).toBeInTheDocument();

        view.rerender(
          <Pagination
            {...props}
            renderEllipsis={jest.fn().mockReturnValue('\u2026Ell\u2026')}
          />,
        );

        expect(screen.getByText('\u2026Ell\u2026')).toBeInTheDocument();
      });

      describe('#isDisabled', () => {
        it('should disable all controlls', () => {
          setup({ isDisabled: true });

          const controls = screen.getAllByRole('button');
          controls.forEach((control) => {
            expect(control).toBeDisabled();
          });
        });
      });
    });
  });

  describe('interactions', () => {
    it('should render only left, current and right page along with 2 ellipsis when some middle page is clicked', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });

      fireEvent.click(screen.getByText('5'));

      expect(onChange.mock.calls[0][1]).toBe(5);

      [
        { page: '1', isSelected: false },
        { page: '4', isSelected: false },
        { page: '5', isSelected: true },
        { page: '6', isSelected: false },
        { page: '10', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });

      expect(screen.getAllByText('\u2026').length).toBe(2);

      ['2', '3', '7', '8', '9'].forEach((page) => {
        expect(screen.queryByText(page)).not.toBeInTheDocument();
      });
    });

    it('should render all the left pages when ellipsis is not required', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });

      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('4'));

      expect(onChange.mock.calls[0][1]).toBe(5);
      expect(onChange.mock.calls[1][1]).toBe(4);

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

      expect(screen.getByText(ellipsis)).toBeInTheDocument();

      ['6', '7', '8', '9'].forEach((page) => {
        expect(screen.queryByText(page)).not.toBeInTheDocument();
      });
    });

    it('should render all the right pages when ellipsis is not required', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });

      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('6'));
      fireEvent.click(screen.getByText('7'));

      expect(onChange.mock.calls[0][1]).toBe(5);
      expect(onChange.mock.calls[1][1]).toBe(6);
      expect(onChange.mock.calls[2][1]).toBe(7);

      [
        { page: '1', isSelected: false },
        { page: '6', isSelected: false },
        { page: '7', isSelected: true },
        { page: '8', isSelected: false },
        { page: '9', isSelected: false },
        { page: '10', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });

      expect(screen.getByText(ellipsis)).toBeInTheDocument();
      ['2', '3', '4', '5'].forEach((page) => {
        expect(screen.queryByText(page)).not.toBeInTheDocument();
      });
    });

    it('should not change page when navigated backwards and first page is selected', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });
      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'previous',
        isEnabled: false,
      });

      fireEvent.click(screen.getByLabelText('previous'));

      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'previous',
        isEnabled: false,
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should change page when navigated forwards and first page is selected', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });
      [
        { page: '1', isSelected: true },
        { page: '2', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'previous',
        isEnabled: false,
      });

      fireEvent.click(screen.getByLabelText('next'));

      [
        { page: '1', isSelected: false },
        { page: '2', isSelected: true },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'previous',
        isEnabled: true,
      });

      expect(onChange.mock.calls[0][1]).toBe(2);
    });

    it('should not change page when navigated forwards and last page is selected', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });

      fireEvent.click(screen.getByText('10'));

      onChange.mockReset();

      [
        { page: '9', isSelected: false },
        { page: '10', isSelected: true },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'next',
        isEnabled: false,
      });

      fireEvent.click(screen.getByLabelText('next'));

      [
        { page: '9', isSelected: false },
        { page: '10', isSelected: true },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'next',
        isEnabled: false,
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should change page when navigated backwards and last page is selected', () => {
      const onChange = jest.fn();
      const { view } = setup({ onChange });

      fireEvent.click(screen.getByText('10'));

      onChange.mockReset();

      [
        { page: '9', isSelected: false },
        { page: '10', isSelected: true },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'next',
        isEnabled: false,
      });

      fireEvent.click(screen.getByLabelText('previous'));

      [
        { page: '9', isSelected: true },
        { page: '10', isSelected: false },
      ].forEach(({ page, isSelected }) => {
        assertPageButtonRendering(view, { page, isSelected });
      });
      assertNavigationButtonRendering(view, {
        label: 'next',
        isEnabled: true,
      });

      expect(onChange.mock.calls[0][1]).toBe(9);
    });

    it('should set aria-current on newly selected page', () => {
      const onChange = jest.fn();
      setup({ onChange });
      expect(
        screen.getByRole('button', { current: 'page' }),
      ).toHaveAccessibleName('page 1');

      fireEvent.click(screen.getByText('5'));
      expect(
        screen.getByRole('button', { current: 'page' }),
      ).toHaveAccessibleName('page 5');
      expect(
        screen.getByRole('button', { name: 'page 1' }),
      ).not.toHaveAttribute('aria-current');
    });
  });
});
