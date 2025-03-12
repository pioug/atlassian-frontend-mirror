import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Blanket from '../../blanket';

describe('ak-blanket', () => {
	describe('exports', () => {
		it('should export a base component', () => {
			expect(Blanket).toBeInstanceOf(Object);
		});
	});

	it('should be possible to create a component', () => {
		expect(render(<Blanket />)).not.toBe(undefined);
	});

	describe('props', () => {
		describe('isTinted', () => {
			it('should not get tint styling by default', () => {
				render(<Blanket />);
				const blanket = screen.getByRole('presentation');

				expect(blanket).toHaveCompiledCss({
					backgroundColor: 'transparent',
				});
			});

			it('should get tint styling when prop set', () => {
				render(<Blanket isTinted={true} />);
				const blanket = screen.getByRole('presentation');

				expect(getComputedStyle(blanket).backgroundColor).not.toBe('transparent');
			});

			it('should not get tint styling when prop set to false', () => {
				render(<Blanket isTinted={false} />);
				const blanket = screen.getByRole('presentation');

				expect(blanket).toHaveCompiledCss({
					backgroundColor: 'transparent',
				});
			});
		});

		describe('shouldAllowClickThrough', () => {
			it('should have pointer-events initial by default', () => {
				render(<Blanket testId="blanket" />);
				const blanket = screen.getByRole('presentation');

				expect(getComputedStyle(blanket).pointerEvents).toBe('auto');
			});
			it('should set correct pointer-events values for different shouldAllowClickThrough prop value', () => {
				const { rerender } = render(<Blanket shouldAllowClickThrough={false} />);
				const blanket = screen.getByRole('presentation');

				expect(getComputedStyle(blanket).pointerEvents).toBe('auto');

				rerender(<Blanket shouldAllowClickThrough={true} />);

				expect(getComputedStyle(blanket).pointerEvents).toBe('none');
			});
			it('should trigger onBlanketClicked when shouldAllowClickThrough is false', async () => {
				const onBlanketClicked = jest.fn();
				render(<Blanket shouldAllowClickThrough={false} onBlanketClicked={onBlanketClicked} />);
				const blanket = screen.getByRole('presentation');
				await userEvent.click(blanket);

				expect(onBlanketClicked).toHaveBeenCalled();
			});
			it('should not trigger onBlanketClicked when shouldAllowClickThrough is true', () => {
				const onBlanketClicked = jest.fn();
				render(<Blanket shouldAllowClickThrough={true} onBlanketClicked={onBlanketClicked} />);
				const blanket = screen.getByRole('presentation');
				fireEvent.click(blanket);

				expect(onBlanketClicked).not.toHaveBeenCalled();
			});
		});

		describe('onBlanketClicked', () => {
			it('should trigger when blanket clicked', async () => {
				const onBlanketClicked = jest.fn();
				render(<Blanket onBlanketClicked={onBlanketClicked} />);
				const blanket = screen.getByRole('presentation');
				await userEvent.click(blanket);

				expect(onBlanketClicked).toHaveBeenCalled();
			});
		});

		describe('children', () => {
			it('should render children when the children prop is passed to blanket', () => {
				render(
					<Blanket>
						<p>blanket with children</p>
					</Blanket>,
				);
				const blanket = screen.getByRole('presentation');

				expect(blanket.innerText).toBe('blanket with children');
			});
		});

		describe('testId', () => {
			it('should be passed as data-testid attribute of the blanket', () => {
				render(<Blanket testId="blanket-test" />);
				const blanket = screen.getByRole('presentation');

				expect(blanket).toHaveAttribute('data-testid', 'blanket-test');
			});
		});
	});
});
