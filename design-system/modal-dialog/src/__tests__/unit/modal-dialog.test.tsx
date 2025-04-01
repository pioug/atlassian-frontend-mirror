import React, { useCallback, useRef, useState } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { width } from '../../internal/utils';
import ModalBody from '../../modal-body';
import ModalTransition from '../../modal-transition';
import ModalDialog from '../../modal-wrapper';
import { type ModalDialogProps } from '../../types';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

type CleanupFn = () => void;

/**
 * Very basic approach to emulate reduced motion. Can refine as needed.
 *
 * Not mocking the `isReducedMotion` from `@atlaskit/motion` because it only seems to work when mocking
 * the relative path, not through the entrypoints. It also is relying on implementation details in another package.
 */
function emulateReducedMotion(): CleanupFn {
	window.matchMedia = (query: string) =>
		({ matches: query === '(prefers-reduced-motion: reduce)' }) as MediaQueryList;

	return () => {
		window.matchMedia = () => ({ matches: false }) as MediaQueryList;
	};
}

const testId = 'test-modal';

const MyContent = () => <div data-testid="test-content">Hello</div>;
const LayeredModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<div data-testid="container">
			<Button appearance="primary" onClick={open} testId="open-modal">
				Open modal
			</Button>

			{isOpen && (
				<ModalDialog onClose={close} testId="modal" label="Layered">
					<ModalBody>
						<DropdownMenu testId="dropdown-menu" trigger="I'm a dropdown menu, click me!">
							<DropdownItemGroup>
								<DropdownItem>Edit</DropdownItem>
								<DropdownItem>Share</DropdownItem>
								<DropdownItem>Move</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</ModalBody>
				</ModalDialog>
			)}
		</div>
	);
};

const createModal = (props?: ModalDialogProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<ModalDialog label="Modal" testId={testId} onClose={noop} {...props} />
);

describe('<ModalDialog />', () => {
	describe('should close popup correctly when escape is pressed', () => {
		render(<LayeredModal />);

		const openModalBtn = screen.getByTestId('open-modal');
		fireEvent.click(openModalBtn);
		const modal = screen.getByTestId('modal');
		const dropdownTrigger = screen.getByTestId('dropdown-menu--trigger');
		expect(dropdownTrigger).toBeInTheDocument();
		expect(modal).toBeInTheDocument();
		expect(screen.queryByTestId('dropdown-menu--content')).not.toBeInTheDocument();

		fireEvent.click(dropdownTrigger);
		expect(screen.getByTestId('dropdown-menu--content')).toBeInTheDocument();
		fireEvent.keyDown(dropdownTrigger, {
			key: 'Escape',
			code: 'Escape',
		});
		expect(screen.queryByTestId('dropdown-menu--content')).not.toBeInTheDocument();
		expect(modal).toBeInTheDocument();
	});
	it('should be a section element', () => {
		render(createModal());

		const element = screen.getByTestId(testId);
		expect(element.tagName).toBe('SECTION');
	});

	it('should set aria modal attribute to the modal to trap the virtual cursor', () => {
		render(createModal());

		const element = screen.queryByTestId(testId)!;
		expect(element).not.toBeNull();

		expect(element).toHaveAttribute('aria-modal', 'true');
	});

	describe('container', () => {
		it('should render custom container around the modal children', () => {
			render(
				createModal({
					children: (
						<form data-testid="form">
							<ModalBody>I'm a modal body!</ModalBody>
						</form>
					),
				}),
			);

			const modalBody = screen.getByTestId(`${testId}--body`);
			const form = screen.getByTestId('form');

			expect(form).toBeInTheDocument();
			expect(form?.contains(modalBody)).toBe(true);
		});
	});

	describe('children', () => {
		it('should render correctly when using a custom child', () => {
			render(
				createModal({
					children: <div data-testid="custom-child" />,
				}),
			);

			const child = screen.queryByTestId('custom-child');
			expect(child).toBeInTheDocument();
		});

		it('should mount only once', () => {
			const mock = jest.fn();
			const CountContent = () => {
				mock();
				return <div>Hello</div>;
			};

			render(
				<ModalTransition>
					{createModal({
						children: <CountContent />,
					})}
				</ModalTransition>,
			);

			expect(mock).toHaveBeenCalledTimes(1);
		});
	});

	describe('height', () => {
		it('should set height in px if a number is passed', () => {
			render(
				createModal({
					height: 42,
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			/**
			 * Need to assert it this way because assertion against CSS variables
			 * is only supported in @testing-library/jest-dom 5.11.3.
			 */
			expect(styles).toContain('--modal-dialog-height: 42px;');
			expect(modalDialog).toHaveCompiledCss('height', '42px', {
				media: `(min-width: 30rem)`,
			});
		});

		it('should set height in the passed value if a % is passed', () => {
			render(
				createModal({
					height: '42%',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-height: 42%;');
		});

		it('should set height in the passed value if an em is passed', () => {
			render(
				createModal({
					height: '42em',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-height: 42em;');
		});

		it('should set height in the passed value if a string is passed', () => {
			render(
				createModal({
					height: 'initial',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-height: initial;');
		});

		it('should set height to "auto" if not supplied', () => {
			render(createModal());

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-height: auto;');
		});
	});

	describe('width', () => {
		it('should set width in px if a number is passed', () => {
			render(
				createModal({
					width: 42,
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			/**
			 * Need to assert it this way because assertion against CSS variables
			 * is only supported in @testing-library/jest-dom 5.11.3.
			 */
			expect(styles).toContain('--modal-dialog-width: 42px;');
		});

		it('should set width in the passed value if a % is passed', () => {
			render(
				createModal({
					width: '42%',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-width: 42%;');
		});

		it('should set width in the passed value if an em is passed', () => {
			render(
				createModal({
					width: '42em',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-width: 42em;');
		});

		it('should set width in the passed value if a string is passed', () => {
			render(
				createModal({
					width: 'initial',
				}),
			);

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain('--modal-dialog-width: initial;');
		});

		it('should set width to "medium" if not supplied', () => {
			render(createModal());

			const modalDialog = screen.getByTestId(testId);
			const styles = modalDialog.getAttribute('style');

			expect(styles).toContain(`--modal-dialog-width: ${width.widths.medium}px;`);
		});

		Object.entries(width.widths).forEach(([widthName, widthValue]) => {
			it(`should set width to ${widthValue}px if "${widthName}" is passed`, () => {
				render(
					createModal({
						width: widthName,
					}),
				);

				const modalDialog = screen.getByTestId(testId);
				const styles = modalDialog.getAttribute('style');

				expect(styles).toContain(`--modal-dialog-width: ${widthValue}px;`);
			});
		});
	});

	describe('onClose', () => {
		it('should trigger when blanket clicked', async () => {
			const spy = jest.fn();
			render(
				createModal({
					onClose: spy,
				}),
			);

			const blanket = screen.getByTestId(`${testId}--blanket`);
			await userEvent.click(blanket);

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should not trigger when modal content is clicked', () => {
			const spy = jest.fn();
			render(
				createModal({
					onClose: spy,
					children: <MyContent />,
				}),
			);

			const content = screen.getByTestId('test-content');
			fireEvent.click(content);

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('onOpenComplete', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should be invoked after modal finished opening', async () => {
			const spy = jest.fn();

			render(
				createModal({
					onOpenComplete: spy,
				}),
			);
			act(() => {
				jest.runAllTimers();
			});

			await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
		});

		ffTest.on('platform_design_system_motion_on_finish_fix', 'reduced motion fix', () => {
			it('should be invoked immediately if reduced motion is enabled', () => {
				const cleanupEmulateReducedMotion = emulateReducedMotion();

				const onOpenComplete = jest.fn();

				render(
					createModal({
						onOpenComplete,
					}),
				);

				expect(onOpenComplete).toHaveBeenCalledTimes(1);

				cleanupEmulateReducedMotion();
			});
		});
	});

	describe('onCloseComplete', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should be invoked after modal finished closing', async () => {
			const spy = jest.fn();

			const ModalWithTransition = ({ isOpen }: { isOpen: boolean }) => (
				<ModalTransition>{isOpen && createModal({ onCloseComplete: spy })}</ModalTransition>
			);

			const { rerender } = render(<ModalWithTransition isOpen />);
			act(() => {
				jest.runAllTimers();
			});

			rerender(<ModalWithTransition isOpen={false} />);
			act(() => {
				jest.runAllTimers();
			});

			await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
		});

		ffTest.on('platform_design_system_motion_on_finish_fix', 'reduced motion fix', () => {
			it('should be invoked immediately if reduced motion is enabled', () => {
				const cleanupEmulateReducedMotion = emulateReducedMotion();

				const onCloseComplete = jest.fn();

				const ModalWithTransition = ({ isOpen }: { isOpen: boolean }) => (
					<ModalTransition>{isOpen && createModal({ onCloseComplete })}</ModalTransition>
				);

				const { rerender } = render(<ModalWithTransition isOpen />);

				rerender(<ModalWithTransition isOpen={false} />);

				expect(onCloseComplete).toHaveBeenCalledTimes(1);

				cleanupEmulateReducedMotion();
			});
		});
	});

	// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
	// https://hello.jira.atlassian.cloud/browse/UTEST-2000
	describe.skip('isBlanketHidden', () => {
		it('set blanket as hidden', () => {
			render(
				createModal({
					isBlanketHidden: true,
				}),
			);

			const blanket = screen.getByTestId(`${testId}--blanket`);
			expect(blanket).toHaveStyle('background-color: transparent');
		});
	});

	describe('shouldCloseOnEscapePress', () => {
		it('should invoke onClose callback on Escape key press by default', () => {
			const spy = jest.fn();
			render(
				createModal({
					onClose: spy,
					children: <MyContent />,
				}),
			);

			// The regular escape event
			const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
				key: 'Escape',
			});

			window.dispatchEvent(escapeKeyDownEvent);
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should not invoke onClose callback on Escape key press when disabled', () => {
			const spy = jest.fn();
			render(
				createModal({
					shouldCloseOnEscapePress: false,
					onClose: spy,
					children: <MyContent />,
				}),
			);

			// The regular escape event
			const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
				key: 'Escape',
			});

			window.dispatchEvent(escapeKeyDownEvent);
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('shouldCloseOnOverlayClick', () => {
		it('should invoke onClose callback on blanket click by default', async () => {
			const callback = jest.fn();
			render(
				createModal({
					onClose: callback,
				}),
			);

			await userEvent.click(screen.getByTestId(`${testId}--blanket`));
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should not invoke onClose callback on blanket click when disabled', () => {
			const callback = jest.fn();
			render(
				createModal({
					shouldCloseOnOverlayClick: false,
					onClose: callback,
				}),
			);

			fireEvent.click(screen.getByTestId(`${testId}--blanket`));

			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('label', () => {
		it('should be used as accessible name', () => {
			render(createModal());
			const modal = screen.getByRole('dialog');

			expect(modal).toHaveAccessibleName('Modal');
			expect(modal).not.toHaveAttribute('aria-labelledby');
		});

		// Skipped until https://product-fabric.atlassian.net/browse/DSP-17750 is merged.
		it.skip('should have `aria-labelledby` if label is not provided', () => {
			render(createModal({ label: undefined }));
			const modal = screen.getByRole('dialog');

			// This is only the case because there is no ModalTitle, which is the default associateion
			expect(modal).not.toHaveAccessibleName();
			expect(modal).toHaveAttribute('aria-labelledby');
		});
	});
});

describe('autoFocus', () => {
	const openModalButtonTestId = 'open-modal';
	const innerButtonTestId = 'inner-button';
	const refElementTestId = 'ref-element';

	// add way to add in element to render
	const Jsx = ({ autoFocus }: { autoFocus: ModalDialogProps['autoFocus'] | 'ref' }) => {
		const [isOpen, setIsOpen] = useState(false);
		const open = () => setIsOpen(true);
		const ref = useRef(null);

		const modalAutoFocus = autoFocus === 'ref' ? ref : autoFocus;

		return (
			<div data-testid="container">
				<Button appearance="primary" onClick={open} testId={openModalButtonTestId}>
					Open modal
				</Button>

				{isOpen && (
					<ModalDialog onClose={close} testId="modal" autoFocus={modalAutoFocus} label="Layered">
						<ModalBody>
							<button data-testid={innerButtonTestId} type="button">
								Click Me
							</button>
							{autoFocus === 'ref' ? (
								<button type="button" ref={ref} data-testid={refElementTestId}>
									Button
								</button>
							) : null}
						</ModalBody>
					</ModalDialog>
				)}
			</div>
		);
	};

	it('should focus on the first interactive element when `autoFocus` is true', async () => {
		const user = userEvent.setup();
		render(<Jsx autoFocus={true} />);

		expect(screen.queryByTestId(innerButtonTestId)).not.toBeInTheDocument();
		await user.click(screen.getByTestId(openModalButtonTestId));
		expect(screen.getByTestId(innerButtonTestId)).toHaveFocus();
	});

	it('should not change from initial focus when `autoFocus` is false', async () => {
		const user = userEvent.setup();
		render(<Jsx autoFocus={false} />);

		expect(screen.queryByTestId(innerButtonTestId)).not.toBeInTheDocument();
		await user.click(screen.getByTestId(openModalButtonTestId));
		// Focus should not have moved
		expect(screen.getByTestId(innerButtonTestId)).not.toHaveFocus();
	});

	it('should focus on element if `ref` is provided to `autoFocus`', async () => {
		const user = userEvent.setup();
		render(<Jsx autoFocus={'ref'} />);

		expect(screen.queryByTestId(refElementTestId)).not.toBeInTheDocument();
		await user.click(screen.getByTestId(openModalButtonTestId));
		// Focus should not have gone to first interactive element
		expect(screen.getByTestId(innerButtonTestId)).not.toHaveFocus();
		expect(screen.getByTestId(refElementTestId)).toHaveFocus();
	});
});

describe('multiple modals', () => {
	it('should position a modal dialog behind two others', () => {
		render(
			createModal({
				testId: 'back',
				children: 'back',
			}),
		);
		render(
			createModal({
				testId: 'middle',
				children: 'middle',
			}),
		);
		render(
			createModal({
				testId: 'front',
				children: 'front',
			}),
		);

		expect(screen.getByTestId('back')).toHaveAttribute('data-modal-stack', '2');
	});

	it('should position a modal dialog in between two others', () => {
		render(
			createModal({
				testId: 'back',
				children: 'back',
			}),
		);
		render(
			createModal({
				testId: 'middle',
				children: 'middle',
			}),
		);
		render(
			createModal({
				testId: 'front',
				children: 'front',
			}),
		);

		expect(screen.getByTestId('middle')).toHaveAttribute('data-modal-stack', '1');
	});

	it('should position a modal dialog infront of two others', () => {
		render(
			createModal({
				testId: 'back',
				children: 'back',
			}),
		);
		render(
			createModal({
				testId: 'middle',
				children: 'middle',
			}),
		);
		render(
			createModal({
				testId: 'front',
				children: 'front',
			}),
		);

		expect(screen.getByTestId('front')).toHaveAttribute('data-modal-stack', '0');
	});

	it('should render a modal dialog inside another modal dialog and be posistioned in the front', () => {
		render(
			<>
				<ModalDialog label="Back">back</ModalDialog>
				<ModalDialog label="Middle">
					middle
					<ModalDialog testId="front" label="Front">
						front
					</ModalDialog>
				</ModalDialog>
			</>,
		);

		expect(screen.getByTestId('front')).toHaveAttribute('data-modal-stack', '0');
	});

	it('should move a modal behind a freshly mounted modal', () => {
		const { rerender } = render(
			<>
				{false}
				<ModalDialog testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		rerender(
			<>
				<ModalDialog testId="second" label="Second">
					second
				</ModalDialog>
				<ModalDialog testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		expect(screen.getByTestId('first')).toHaveAttribute('data-modal-stack', '1');
	});

	it('should move a modal to the front a freshly unmounted modal', () => {
		const { rerender } = render(
			<>
				<ModalDialog testId="second" label="Second">
					second
				</ModalDialog>
				<ModalDialog testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		rerender(
			<>
				{false}
				<ModalDialog testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		expect(screen.getByTestId('first')).toHaveAttribute('data-modal-stack', '0');
	});

	it('should force a position in the stack', () => {
		render(
			<>
				<ModalDialog testId="second" label="Second">
					second
				</ModalDialog>
				{/* Force stack index of 1 instead of 0 */}
				<ModalDialog stackIndex={1} testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		expect(screen.getByTestId('first')).toHaveAttribute('data-modal-stack', '1');
	});

	it('should not invoke onStackChange callback if the position has not changed', () => {
		const callback = jest.fn();
		const { rerender } = render(
			<>
				<ModalDialog testId="second" label="Second">
					second
				</ModalDialog>
				<ModalDialog onStackChange={callback} testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		rerender(
			<>
				{false}
				<ModalDialog onStackChange={callback} testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		expect(callback).toHaveBeenCalledTimes(0);
	});

	it('should callback on stack change when going to the front', () => {
		const callback = jest.fn();
		const { rerender } = render(
			<>
				<ModalDialog onStackChange={callback} testId="second" label="Second">
					second
				</ModalDialog>
				<ModalDialog testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		rerender(
			<>
				<ModalDialog onStackChange={callback} testId="second" label="Second">
					second
				</ModalDialog>
				{false}
			</>,
		);

		expect(callback).toHaveBeenLastCalledWith(0);
	});

	it('should callback on stack change when going to the back', () => {
		const callback = jest.fn();
		const { rerender } = render(
			<>
				{false}
				<ModalDialog onStackChange={callback} testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		rerender(
			<>
				<ModalDialog testId="second" label="Second">
					second
				</ModalDialog>
				<ModalDialog onStackChange={callback} testId="first" label="First">
					first
				</ModalDialog>
			</>,
		);

		expect(callback).toHaveBeenCalledWith(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should not apply animation to the active modal after stack shift has finished', () => {
		const { rerender } = render(
			<>
				<ModalDialog testId="back" label="Back">
					back
				</ModalDialog>
				<ModalDialog testId="front" label="Front">
					front
				</ModalDialog>
			</>,
		);

		expect(screen.getByTestId('back--positioner')).toHaveStyle(
			'--modal-dialog-translate-y: calc(1px * var(--ds-space-100, 8px));',
		);
		expect(screen.getByTestId('back--positioner')).toHaveCompiledCss(
			'transform',
			'translateY(calc(1px * var(--ds-space-100, 8px)))',
		);

		expect(screen.getByTestId('front--positioner')).toHaveCompiledCss('transform', 'none');

		rerender(
			<>
				<ModalDialog testId="back" label="Back">
					back
				</ModalDialog>
				{false}
			</>,
		);

		// Now that the modal has shifted to the front and is active,
		// it should set transform back to 'none'.
		expect(screen.getByTestId('back--positioner')).toHaveCompiledCss('transform', 'none');
	});
});
