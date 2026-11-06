import React, { forwardRef } from 'react';

import Button from '@atlaskit/button/default/button';
import __noop from '@atlaskit/ds-lib/noop';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';
import type { PopupComponentProps, TriggerProps } from '../../types';

const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, 'data-testid': testId, id }, ref) => (
		<section ref={ref} data-testid={testId} id={id}>
			{children}
		</section>
	),
);
CustomContainer.displayName = 'CustomContainer';

describe('Popup with composable API', () => {
	it('should render correctly when popup is closed', () => {
		render(
			<Popup>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		const trigger = screen.getByText('trigger');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByText('content')).not.toBeInTheDocument();
	});

	it('should render correctly when popup is open', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		const trigger = screen.getByText('trigger');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByText('content')).toBeInTheDocument();
	});

	it('should call onClose when clicking outside the popup', async () => {
		const onClose = jest.fn();
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent onClose={onClose}>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		await userEvent.click(document.body);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('should call onClose when pressing ESC key', async () => {
		const onClose = jest.fn();
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent onClose={onClose}>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	describe('trigger press on the top layer', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		// The trigger is outside the auto popover, so a press on it light-dismisses the popup.
		it('should call onClose when clicking on trigger', async () => {
			const onClose = jest.fn();
			render(
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent onClose={onClose}>{() => <div>content</div>}</PopupContent>
				</Popup>,
			);

			await userEvent.click(screen.getByText('trigger'));

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('trigger press on the legacy path', () => {
		beforeEach(() => {
			failGate('platform-dst-top-layer');
		});

		// The legacy popup ignores a press on the trigger. The trigger closes it itself.
		it('should call onClose when clicking on trigger', async () => {
			const onClose = jest.fn();
			render(
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" onClick={onClose} {...triggerProps}>
								trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent onClose={onClose}>{() => <div>content</div>}</PopupContent>
				</Popup>,
			);

			await userEvent.click(screen.getByText('trigger'));

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('`aria-controls`', () => {
		describe('on the top layer', () => {
			beforeEach(() => {
				passGate('platform-dst-top-layer');
			});

			// The `Popover` host has the id and the `--container` test id.
			it('should be set if no `id` provided', () => {
				render(
					<Popup isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				const triggerAriaControlsValue = screen.getByText('trigger').getAttribute('aria-controls');

				expect(triggerAriaControlsValue).toBeTruthy();

				// They should match
				expect(screen.getByTestId('popup-container--container')).toHaveAttribute(
					'id',
					triggerAriaControlsValue,
				);
			});

			it('should be set with the provided `id`', () => {
				const id = 'id';

				render(
					<Popup id={id} isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				expect(screen.getByText('trigger')).toHaveAttribute('aria-controls', id);

				expect(screen.getByTestId('popup-container--container')).toHaveAttribute('id', id);
			});

			it('should put the `id` only on the host when a `popupComponent` is used', () => {
				const id = 'id';

				render(
					<Popup id={id} isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container" popupComponent={CustomContainer}>
							{() => <div>content</div>}
						</PopupContent>
					</Popup>,
				);

				expect(screen.getByTestId('popup-container--container')).toHaveAttribute('id', id);
				expect(screen.getByTestId('popup-container')).not.toHaveAttribute('id');
			});

			// The host is not in the DOM while closed.
			it('should not be set while closed', () => {
				render(
					<Popup>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				expect(screen.getByText('trigger')).not.toHaveAttribute('aria-controls');
			});
		});

		describe('on the legacy path', () => {
			beforeEach(() => {
				failGate('platform-dst-top-layer');
			});

			it('should be set if no `id` provided', () => {
				render(
					<Popup isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				const triggerAriaControlsValue = screen.getByText('trigger').getAttribute('aria-controls');

				expect(triggerAriaControlsValue).toBeTruthy();

				// They should match
				expect(screen.getByTestId('popup-container')).toHaveAttribute(
					'id',
					triggerAriaControlsValue,
				);
			});

			it('should be set with the provided `id`', () => {
				const id = 'id';

				render(
					<Popup id={id} isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				expect(screen.getByText('trigger')).toHaveAttribute('aria-controls', id);

				expect(screen.getByTestId('popup-container')).toHaveAttribute('id', id);
			});
		});

		it('should have aria-haspopup set to dialog if role is dialog', () => {
			render(
				<Popup role="dialog">
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent role="dialog" testId="popup-container">
						{() => <div>content</div>}
					</PopupContent>
				</Popup>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-haspopup',
				'dialog',
			);
		});

		describe('aria-haspopup without a role on the legacy path', () => {
			beforeEach(() => {
				failGate('platform-dst-top-layer');
			});

			it('should have aria-haspopup set to true if role is not dialog', () => {
				render(
					<Popup>
						<PopupTrigger>
							{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
						</PopupTrigger>
						<PopupContent testId="popup-container">{() => <div>content</div>}</PopupContent>
					</Popup>,
				);

				expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
					'aria-haspopup',
					'true',
				);
			});
		});
	});

	describe('trigger aria-haspopup on the top layer', () => {
		it('should not set aria-haspopup when the popup has no role', () => {
			passGate('platform-dst-top-layer');

			render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent>{() => <div>content</div>}</PopupContent>
				</Popup>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveAttribute('aria-haspopup');
		});

		// The role decides focus too: a popup with no role takes no focus.
		it('should keep focus on the trigger when the popup has no role', () => {
			passGate('platform-dst-top-layer');

			const { rerender } = render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent>{() => <button type="button">Inside</button>}</PopupContent>
				</Popup>,
			);
			const trigger = screen.getByRole('button', { name: 'Trigger' });
			trigger.focus();

			rerender(
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent>{() => <button type="button">Inside</button>}</PopupContent>
				</Popup>,
			);

			expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument();
			expect(trigger).toHaveFocus();
		});

		it('should set aria-haspopup to dialog if role is dialog', () => {
			passGate('platform-dst-top-layer');

			render(
				<Popup role="dialog">
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent role="dialog" label="Content">
						{() => <div>content</div>}
					</PopupContent>
				</Popup>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-haspopup',
				'dialog',
			);
		});
	});

	it('should set aria-haspopup to true when the popup has no role', () => {
		failGate('platform-dst-top-layer');

		render(
			<Popup>
				<PopupTrigger>{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}</PopupTrigger>
				<PopupContent>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
			'aria-haspopup',
			'true',
		);
	});

	it('should throw an error when PopupContent is not a child of Popup', () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);

		expect(() => {
			render(<PopupContent>{() => <div>content</div>}</PopupContent>);
		}).toThrow();

		consoleError.mockRestore();
	});

	it('should throw an error when PopupTrigger is not a child of Popup', () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(__noop);

		expect(() => {
			render(<PopupTrigger>{() => <div>trigger</div>}</PopupTrigger>);
		}).toThrow();

		consoleError.mockRestore();
	});

	it('should render the popup inside the parent when shouldRenderToParent is true', () => {
		render(
			<div data-testid="parent">
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent shouldRenderToParent>{() => <div>content</div>}</PopupContent>
				</Popup>
			</div>,
		);

		const parent = screen.getByTestId('parent');
		const popup = screen.getByText('content');

		expect(parent).toContainElement(popup);
	});

	describe('content render prop on the top layer', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		it('should not call children while closed', () => {
			const content = jest.fn(() => <div>content</div>);

			const { rerender } = render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent>{content}</PopupContent>
				</Popup>,
			);

			expect(content).not.toHaveBeenCalled();

			rerender(
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => <Button {...triggerProps}>Trigger</Button>}
					</PopupTrigger>
					<PopupContent>{content}</PopupContent>
				</Popup>,
			);

			expect(content).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }));
		});
	});

	describe('shouldRenderToParent on the top layer', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		// The popover always renders in place, so `shouldRenderToParent` has no effect.
		it('should render the popup inside the parent when shouldRenderToParent is false', () => {
			render(
				<div data-testid="parent">
					<Popup isOpen>
						<PopupTrigger>
							{(triggerProps) => (
								<button type="button" {...triggerProps}>
									trigger
								</button>
							)}
						</PopupTrigger>
						<PopupContent shouldRenderToParent={false}>{() => <div>content</div>}</PopupContent>
					</Popup>
				</div>,
			);

			expect(screen.getByTestId('parent')).toContainElement(screen.getByText('content'));
		});
	});

	it('should not render the popup inside the parent when shouldRenderToParent is false', () => {
		// Legacy only: the top-layer popup always renders in place. That is covered in
		// `composable-popup-top-layer.test.tsx`.
		failGate('platform-dst-top-layer');
		render(
			<div data-testid="parent">
				<Popup isOpen>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent shouldRenderToParent={false}>{() => <div>content</div>}</PopupContent>
				</Popup>
			</div>,
		);

		const parent = screen.getByTestId('parent');
		const popup = screen.queryByText('content');

		expect(popup).toBeInTheDocument();
		expect(parent).not.toContainElement(popup);
	});

	it('does not re-render the trigger unnecessarily', () => {
		const triggerRender = jest.fn();
		const contentRender = jest.fn();

		const trigger = (props: TriggerProps) => {
			triggerRender();
			return (
				<button type="button" ref={props.ref} aria-expanded={props['aria-expanded']}>
					trigger
				</button>
			);
		};

		const content = () => {
			contentRender();
			return <div>content</div>;
		};

		const { rerender } = render(
			<Popup>
				<PopupTrigger>{trigger}</PopupTrigger>
				<PopupContent>{content}</PopupContent>
			</Popup>,
		);

		expect(triggerRender).toHaveBeenCalledTimes(1);

		rerender(
			<Popup isOpen>
				<PopupTrigger>{trigger}</PopupTrigger>
				<PopupContent>{content}</PopupContent>
			</Popup>,
		);

		expect(triggerRender).toHaveBeenCalledTimes(2);

		rerender(
			<Popup isOpen>
				<PopupTrigger>{trigger}</PopupTrigger>
				<PopupContent>{content}</PopupContent>
			</Popup>,
		);
	});
});
