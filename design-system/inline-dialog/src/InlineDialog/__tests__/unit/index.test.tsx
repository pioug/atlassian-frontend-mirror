import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import InlineDialog from '../../../index';

declare var global: any;

interface InlineDialogWrapperProps {
	inlineDialogTestId: string;
	buttonTestId: string;
}

jest.mock('popper.js', () => {
	// @ts-ignore requireActual property is missing from jest
	const PopperJS = jest.requireActual('popper.js');

	return class Popper {
		static placements = PopperJS.placements;

		constructor() {
			return {
				// eslint-disable-next-line
				destroy: () => {},
				// eslint-disable-next-line
				update: () => {},
			};
		}
	};
});

describe('inline-dialog', () => {
	it('should render the children of an inline dialog as the target', () => {
		render(
			<InlineDialog content={null}>
				<div data-testid="child-content">Click me!</div>
			</InlineDialog>,
		);

		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	describe('isOpen', () => {
		const content = (
			<div data-testid="inline-dialog-content">
				<p>Hello!</p>
			</div>
		);

		it('should render the content when is open', () => {
			render(
				<InlineDialog content={content} isOpen={true}>
					<div id="children" />
				</InlineDialog>,
			);

			expect(screen.getByTestId('inline-dialog-content')).toBeInTheDocument();
		});

		it('should not render the content when is not open', () => {
			render(
				<InlineDialog content={content} isOpen={false}>
					<div id="children" />
				</InlineDialog>,
			);

			expect(screen.queryByTestId('inline-dialog-content')).not.toBeInTheDocument();
		});
	});

	describe('onContentClick', () => {
		it('should be triggered when the content is clicked', () => {
			const spy = jest.fn();
			const dummyContent = <div data-testid="dummy-content">This is some content</div>;
			render(
				<InlineDialog onContentClick={spy} content={dummyContent} isOpen>
					<div>trigger</div>
				</InlineDialog>,
			);

			fireEvent.click(screen.getByTestId('dummy-content'));

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('onContentFocus', () => {
		it('should be triggered when an element in the content is focused', () => {
			const spy = jest.fn();
			const dummyLink = fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
				<Link data-testid="dummy-link" href="/test">
					This is a dummy link
				</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a data-testid="dummy-link" href="/test">
					This is a dummy link
				</a>
			);

			render(
				<InlineDialog onContentFocus={spy} content={dummyLink} isOpen>
					<div id="children" />
				</InlineDialog>,
			);

			fireEvent.focus(screen.getByTestId('dummy-link'));

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('onContentBlur', () => {
		it('should be triggered when an element in the content is blurred', () => {
			const spy = jest.fn();
			const dummyLink = fg('dst-a11y__replace-anchor-with-link__design-system-') ? (
				<Link data-testid="dummy-link" href="/test">
					This is a dummy link
				</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a data-testid="dummy-link" href="/test">
					This is a dummy link
				</a>
			);
			render(
				<InlineDialog onContentBlur={spy} content={dummyLink} isOpen>
					<div id="children" />
				</InlineDialog>,
			);

			fireEvent.blur(screen.getByTestId('dummy-link'));

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('handleCloseRequest', () => {
		afterEach(() => {
			jest.restoreAllMocks();
			jest.useRealTimers();
		});

		describe('EventListeners', () => {
			let addSpy: jest.SpyInstance;
			let removeSpy: jest.SpyInstance;
			beforeEach(() => {
				addSpy = jest.spyOn(window, 'addEventListener');
				removeSpy = jest.spyOn(window, 'removeEventListener');
			});

			it('should add event listener onOpen', () => {
				render(
					<InlineDialog content={null} isOpen testId="inline-dialog">
						<div id="children" />
					</InlineDialog>,
				);

				act(() => {
					jest.runAllTimers(); // trigger setTimeout
				});

				expect(screen.getByTestId('inline-dialog')).toBeInTheDocument();
				expect(addSpy.mock.calls.filter(([event]) => event === 'click')).toHaveLength(1);
				expect(addSpy.mock.calls.filter(([event]) => event === 'keydown')).toHaveLength(1);
				expect(removeSpy.mock.calls.filter(([event]) => event === 'click')).toHaveLength(0);
				expect(removeSpy.mock.calls.filter(([event]) => event === 'keydown')).toHaveLength(0);
			});

			it('should remove event listener onOpen => remove onClose', () => {
				jest.useFakeTimers(); // mock timers

				const { rerender } = render(
					<InlineDialog content={null} isOpen testId="inline-dialog">
						<div id="children" />
					</InlineDialog>,
				);

				act(() => {
					jest.runAllTimers(); // trigger setTimeout
				});

				expect(screen.getByTestId('inline-dialog')).toBeInTheDocument();
				expect(addSpy.mock.calls.filter(([event]) => event === 'click')).toHaveLength(1);
				expect(addSpy.mock.calls.filter(([event]) => event === 'keydown')).toHaveLength(1);

				rerender(
					<InlineDialog content={null} testId="inline-dialog">
						<div id="children" />
					</InlineDialog>,
				);

				// no new event listeners added
				expect(addSpy.mock.calls.filter(([event]) => event === 'click')).toHaveLength(1);
				expect(addSpy.mock.calls.filter(([event]) => event === 'keydown')).toHaveLength(1);
				expect(removeSpy.mock.calls.filter(([event]) => event === 'click')).toHaveLength(1);
				expect(removeSpy.mock.calls.filter(([event]) => event === 'keydown')).toHaveLength(1);
			});
		});

		it('should invoke onClose callback on page click by default', () => {
			const callback = jest.fn();
			jest.useFakeTimers(); // mock timers

			render(
				<InlineDialog content={null} onClose={callback} isOpen>
					<div id="children" />
				</InlineDialog>,
			);

			act(() => {
				jest.runAllTimers(); // trigger setTimeout
			});

			// click anywhere outside of inline dialog
			fireEvent.click(document.body);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should invoke onClose callback on escaoe by default', () => {
			const callback = jest.fn();
			jest.useFakeTimers(); // mock timers

			render(
				<InlineDialog content={null} onClose={callback} isOpen>
					<div id="children" />
				</InlineDialog>,
			);

			act(() => {
				jest.runAllTimers(); // trigger setTimeout
			});

			// press escape anywhere outside of inline dialog
			fireEvent.keyDown(document.body, { key: 'Escape' });
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should invoke onClose callback on escaoe when focused on triggering element', () => {
			const callback = jest.fn();
			jest.useFakeTimers(); // mock timers

			render(
				<InlineDialog content={null} onClose={callback} isOpen>
					<button type="button" id="children">
						Test
					</button>
				</InlineDialog>,
			);

			act(() => {
				jest.runAllTimers(); // trigger setTimeout
			});

			const el = screen.getByText('Test');

			// Focus on triggering element. Not sure this is necessary considering
			// we're calling keydown on the element itself, but wanted to make sure
			el.focus();
			expect(el).toHaveFocus();

			// press escape on triggering element
			fireEvent.keyDown(el, { key: 'Escape' });
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should NOT invoke onClose callback when isOpen is false', () => {
			const callback = jest.fn();
			render(
				<InlineDialog content={null} onClose={callback}>
					<div id="children" />
				</InlineDialog>,
			);

			// click anywhere outside of inline dialog
			fireEvent.click(document);
			expect(callback).not.toHaveBeenCalledTimes(1);
		});

		it('should open and close correctly when one dialog is opened after the other', () => {
			const content = <div>Hello!</div>;

			const InlineDialogWrapper = (props: InlineDialogWrapperProps) => {
				const { inlineDialogTestId, buttonTestId } = props;
				const [dialogOpen, setDialogOpen] = useState<boolean>(false);

				const toggleInlineDialog = () => {
					setDialogOpen(true);
				};

				return (
					<InlineDialog
						content={content}
						isOpen={dialogOpen}
						onClose={() => {
							setDialogOpen(false);
						}}
						testId={inlineDialogTestId}
					>
						<Button onClick={() => toggleInlineDialog()} testId={buttonTestId}>
							Click me!
						</Button>
					</InlineDialog>
				);
			};

			render(
				<div>
					<InlineDialogWrapper
						inlineDialogTestId="inline-dialog-0"
						buttonTestId="open-inline-dialog-0"
					/>
					<InlineDialogWrapper
						inlineDialogTestId="inline-dialog-1"
						buttonTestId="open-inline-dialog-1"
					/>
				</div>,
			);

			// Open first dialog, second dialog should not exist yet.
			fireEvent.click(screen.getByTestId('open-inline-dialog-0'));
			expect(screen.getByTestId('inline-dialog-0')).toBeInTheDocument();
			expect(screen.queryByTestId('inline-dialog-1')).not.toBeInTheDocument();

			// Open second dialog, first dialog should close.
			fireEvent.click(screen.getByTestId('open-inline-dialog-1'));
			expect(screen.getByTestId('inline-dialog-1')).toBeInTheDocument();
			expect(screen.queryByTestId('inline-dialog-0')).not.toBeInTheDocument();
		});
	});
});

describe('InlineDialogWithAnalytics', () => {
	let consoleWarn: jest.SpyInstance;
	let consoleError: jest.SpyInstance;

	beforeEach(() => {
		consoleWarn = jest.spyOn(global.console, 'warn');
		consoleError = jest.spyOn(global.console, 'error');
	});

	afterEach(() => {
		consoleWarn.mockRestore();
		consoleError.mockRestore();
		jest.useRealTimers();
	});

	it('should mount without errors', () => {
		render(<InlineDialog children={''} content={''} />);

		expect(console.warn).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
	});
});
