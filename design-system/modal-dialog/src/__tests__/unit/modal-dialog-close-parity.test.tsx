import React, { useState } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render } from '@atlassian/testing-library/testing-library/react';

import ModalBody from '../../modal-body';
import ModalDialog from '../../modal-dialog';
import ModalTransition from '../../modal-transition';
import { type ModalDialogProps } from '../../types';

jest.mock('raf-schd', () => (fn: () => void) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

type TCloseProps = Pick<ModalDialogProps, 'shouldCloseOnEscapePress' | 'shouldCloseOnOverlayClick'>;

function ClosingModal({
	onClose,
	shouldCloseOnEscapePress,
	shouldCloseOnOverlayClick,
}: TCloseProps & { onClose: jest.Mock }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog
					shouldCloseOnEscapePress={shouldCloseOnEscapePress}
					shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
					testId="modal"
					label="Test modal"
					onClose={() => {
						onClose();
						setIsOpen(false);
					}}
				>
					<ModalBody>
						<button data-testid="content-button" type="button">
							Action
						</button>
					</ModalBody>
				</ModalDialog>
			)}
		</ModalTransition>
	);
}

function TriggeredModal({
	id,
	onClose,
	children,
}: {
	id: string;
	onClose: jest.Mock;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button data-testid={`${id}-trigger`} type="button" onClick={() => setIsOpen(true)}>
				Open {id}
			</button>
			<ModalTransition>
				{isOpen && (
					<ModalDialog
						testId={id}
						label={id}
						onClose={() => {
							onClose();
							setIsOpen(false);
						}}
					>
						<ModalBody>{children}</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}

function IgnoringModal({ onClose }: { onClose: jest.Mock }) {
	return (
		<ModalDialog testId="modal" label="Test modal" onClose={() => onClose()}>
			<ModalBody>
				<button data-testid="content-button" type="button">
					Action
				</button>
			</ModalBody>
		</ModalDialog>
	);
}

// Runs the polyfill's task-queued `cancel`, Dialog toggles, and legacy timers, but not the exit.
function flushTasks() {
	act(() => {
		jest.advanceTimersByTime(1);
	});
}

/**
 * Where a user's Escape lands. A browser moves focus into a modal `<dialog>` when it opens, so an
 * Escape with focus on `<body>` goes to the top open `<dialog>`. jsdom does not move focus.
 */
function getEscapeTarget(): Element {
	// eslint-disable-next-line testing-library/no-node-access -- where focus is, as a browser sees it
	const focused = document.activeElement;
	if (focused && focused !== document.body) {
		return focused;
	}
	// eslint-disable-next-line testing-library/no-node-access -- the top open `<dialog>`, in document order
	const openDialogs = Array.from(document.querySelectorAll('dialog[open]'));
	return openDialogs[openDialogs.length - 1] ?? document.body;
}

function pressEscape(target: Element = getEscapeTarget()) {
	fireEvent.keyDown(target, { key: 'Escape' });
	flushTasks();
	fireEvent.keyUp(target, { key: 'Escape' });
	flushTasks();
}

// A held key repeats `keydown`, then sends one `keyup`.
function holdEscape(target: Element) {
	fireEvent.keyDown(target, { key: 'Escape' });
	fireEvent.keyDown(target, { key: 'Escape', repeat: true });
	fireEvent.keyDown(target, { key: 'Escape', repeat: true });
	flushTasks();
	fireEvent.keyUp(target, { key: 'Escape' });
	flushTasks();
}

function clickElement(element: Element) {
	fireEvent.pointerDown(element);
	fireEvent.mouseDown(element);
	fireEvent.pointerUp(element);
	fireEvent.mouseUp(element);
	fireEvent.click(element);
	flushTasks();
}

// Browsers fire `click` on the nearest common ancestor of the press and the release.
function dragElement({ from, to, ancestor }: { from: Element; to: Element; ancestor: Element }) {
	fireEvent.pointerDown(from);
	fireEvent.mouseDown(from);
	fireEvent.pointerUp(to);
	fireEvent.mouseUp(to);
	fireEvent.click(ancestor);
	flushTasks();
}

const combinations: Array<{
	props: TCloseProps;
	escape: number;
	backdrop: number;
}> = [
	{
		props: { shouldCloseOnEscapePress: true, shouldCloseOnOverlayClick: true },
		escape: 1,
		backdrop: 1,
	},
	{
		props: { shouldCloseOnEscapePress: true, shouldCloseOnOverlayClick: false },
		escape: 1,
		backdrop: 0,
	},
	{
		props: { shouldCloseOnEscapePress: false, shouldCloseOnOverlayClick: true },
		escape: 0,
		backdrop: 1,
	},
	{
		props: { shouldCloseOnEscapePress: false, shouldCloseOnOverlayClick: false },
		escape: 0,
		backdrop: 0,
	},
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe.each([false, true])(
	'ModalDialog onClose parity (platform-dst-top-layer=%s)',
	(isTopLayer) => {
		const originalMatchMedia = window.matchMedia;
		const originalGetAnimations = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			'getAnimations',
		);
		// Never settles, so the top-layer exit stays open. Fake timers hold the legacy exit.
		const pendingAnimation = { finished: new Promise<Animation>(() => {}) } as Animation;

		beforeEach(() => {
			jest.useFakeTimers();
			if (isTopLayer) {
				passGate('platform-dst-top-layer');
			} else {
				failGate('platform-dst-top-layer');
			}
			window.matchMedia = () => ({ matches: false }) as MediaQueryList;
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
				configurable: true,
				value: () => [pendingAnimation],
			});
		});

		afterEach(() => {
			jest.useRealTimers();
			window.matchMedia = originalMatchMedia;
			if (originalGetAnimations) {
				Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
			} else {
				Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
			}
		});

		function getBackdrop() {
			return screen.getByTestId(isTopLayer ? 'modal' : 'modal--blanket');
		}

		function renderModal(element: React.ReactElement) {
			render(element);
			flushTasks();
		}

		describe.each(combinations)('with $props', ({ props, escape, backdrop }) => {
			it(`should call onClose ${escape} time(s) for one Escape`, () => {
				const onClose = jest.fn();
				renderModal(<ClosingModal {...props} onClose={onClose} />);
				pressEscape();
				expect(onClose).toHaveBeenCalledTimes(escape);
			});

			it(`should call onClose ${backdrop} time(s) for one backdrop click`, () => {
				const onClose = jest.fn();
				renderModal(<ClosingModal {...props} onClose={onClose} />);
				clickElement(getBackdrop());
				expect(onClose).toHaveBeenCalledTimes(backdrop);
			});
		});

		/**
		 * The second action runs during the exit when the first one closed the modal. Legacy calls
		 * `onClose` again. The top-layer path does not: the modal is already closing.
		 */
		function getCalls({ first, second }: { first: number; second: number }): number {
			if (isTopLayer && first > 0) {
				return first;
			}
			return first + second;
		}

		describe.each(combinations)('with $props, two actions', ({ props, escape, backdrop }) => {
			it.each([
				{ first: 'Escape', second: 'Escape', calls: getCalls({ first: escape, second: escape }) },
				{
					first: 'Escape',
					second: 'backdrop click',
					calls: getCalls({ first: escape, second: backdrop }),
				},
				{
					first: 'backdrop click',
					second: 'backdrop click',
					calls: getCalls({ first: backdrop, second: backdrop }),
				},
				{
					first: 'backdrop click',
					second: 'Escape',
					calls: getCalls({ first: backdrop, second: escape }),
				},
			])(
				'should call onClose $calls time(s) for $first then $second',
				({ first, second, calls }) => {
					const onClose = jest.fn();
					renderModal(<ClosingModal {...props} onClose={onClose} />);
					const dismiss = (action: string) =>
						action === 'Escape' ? pressEscape() : clickElement(getBackdrop());
					dismiss(first);
					// Still mounted: the exit, if any, has not finished.
					expect(screen.getByTestId('modal--body')).toBeInTheDocument();
					dismiss(second);
					expect(onClose).toHaveBeenCalledTimes(calls);
				},
			);
		});

		it('should not call onClose for clicks inside the modal content', () => {
			const onClose = jest.fn();
			renderModal(<ClosingModal onClose={onClose} />);
			clickElement(screen.getByTestId('content-button'));
			clickElement(screen.getByTestId('modal--body'));
			expect(onClose).toHaveBeenCalledTimes(0);
		});

		it('should not call onClose for a drag from the content to the backdrop', () => {
			const onClose = jest.fn();
			renderModal(<ClosingModal onClose={onClose} />);
			fireEvent.pointerDown(screen.getByTestId('content-button'));
			fireEvent.mouseDown(screen.getByTestId('content-button'));
			fireEvent.mouseUp(getBackdrop());
			// Browsers fire `click` on the nearest common ancestor: the backdrop element.
			fireEvent.click(getBackdrop());
			flushTasks();
			expect(onClose).toHaveBeenCalledTimes(0);
		});

		// Legacy content is inside the Blanket, so the `click` lands on the Blanket. Known difference.
		it('should call onClose for a drag from the backdrop into the content only on the legacy path', () => {
			const onClose = jest.fn();
			renderModal(<ClosingModal onClose={onClose} />);
			dragElement({
				from: getBackdrop(),
				to: screen.getByTestId('content-button'),
				ancestor: getBackdrop(),
			});
			expect(onClose).toHaveBeenCalledTimes(isTopLayer ? 0 : 1);
		});

		it('should call onClose again for a drag from the backdrop into the content during the exit only on the legacy path', () => {
			const onClose = jest.fn();
			renderModal(<ClosingModal onClose={onClose} />);
			clickElement(getBackdrop());
			// Still mounted: the exit has not finished.
			expect(screen.getByTestId('modal--body')).toBeInTheDocument();
			dragElement({
				from: getBackdrop(),
				to: screen.getByTestId('content-button'),
				ancestor: getBackdrop(),
			});
			expect(onClose).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
		});

		it('should call onClose for each Escape when the consumer keeps the modal open', () => {
			const onClose = jest.fn();
			renderModal(<IgnoringModal onClose={onClose} />);
			pressEscape();
			pressEscape();
			pressEscape();
			expect(onClose).toHaveBeenCalledTimes(3);
		});

		it('should call onClose once for a held Escape when the consumer keeps the modal open', () => {
			const onClose = jest.fn();
			renderModal(<IgnoringModal onClose={onClose} />);
			holdEscape(screen.getByTestId('content-button'));
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('should call onClose for each backdrop click when the consumer keeps the modal open', () => {
			const onClose = jest.fn();
			renderModal(<IgnoringModal onClose={onClose} />);
			clickElement(getBackdrop());
			clickElement(getBackdrop());
			clickElement(getBackdrop());
			expect(onClose).toHaveBeenCalledTimes(3);
		});

		it('should call onClose again for an Escape on the trigger during the exit only on the legacy path', () => {
			const onClose = jest.fn();
			renderModal(<TriggeredModal id="modal" onClose={onClose} />);
			clickElement(screen.getByTestId('modal-trigger'));
			pressEscape();
			// Still mounted: the exit has not finished.
			expect(screen.getByTestId('modal')).toBeInTheDocument();
			pressEscape(screen.getByTestId('modal-trigger'));
			expect(onClose).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
		});

		// Legacy: the exiting nested modal takes the Escape again. Top-layer: the outer modal asks.
		it('should send an Escape on the nested trigger during its exit to the nested modal on legacy and the outer modal on top-layer', () => {
			const onCloseOuter = jest.fn();
			const onCloseInner = jest.fn();
			renderModal(
				<TriggeredModal id="outer" onClose={onCloseOuter}>
					<TriggeredModal id="inner" onClose={onCloseInner} />
				</TriggeredModal>,
			);
			clickElement(screen.getByTestId('outer-trigger'));
			clickElement(screen.getByTestId('inner-trigger'));
			pressEscape();
			expect(screen.getByTestId('inner')).toBeInTheDocument();
			pressEscape(screen.getByTestId('inner-trigger'));
			expect(onCloseInner).toHaveBeenCalledTimes(isTopLayer ? 1 : 2);
			expect(onCloseOuter).toHaveBeenCalledTimes(isTopLayer ? 1 : 0);
		});
	},
);
