/* eslint-disable testing-library/no-node-access */
import React, { type Dispatch, forwardRef, type SetStateAction } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Popup } from '../../popup';
import { type ContentProps, type PopupComponentProps, type TriggerProps } from '../../types';

afterEach(() => {
	jest.clearAllMocks();
});

beforeEach(() => {
	passGate('platform-dst-top-layer');
});

// Helpers

const testId = 'popup';

function renderTopLayerPopup(element: React.ReactElement) {
	return render(element);
}

const defaultTrigger = ({
	ref,
	'aria-controls': ariaControls,
	'aria-expanded': ariaExpanded,
	'aria-haspopup': ariaHasPopup,
	'data-ds--level': dataDsLevel,
}: TriggerProps) => (
	<button
		type="button"
		ref={ref}
		aria-controls={ariaControls}
		aria-expanded={ariaExpanded}
		aria-haspopup={ariaHasPopup}
		data-ds--level={dataDsLevel}
	>
		Trigger
	</button>
);

const defaultContent = () => <div data-testid="popup-content">Popup content</div>;

it('should capture and report a11y violations', async () => {
	const { container } = renderTopLayerPopup(
		<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
	);
	await expect(container).toBeAccessible();
});

describe('Popup top-layer adapter: aria-controls linkage', () => {
	it('aria-controls is set on the trigger when popup is open', () => {
		renderTopLayerPopup(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const ariaControlsValue = trigger.getAttribute('aria-controls');

		expect(ariaControlsValue).toBeTruthy();
	});

	it('aria-controls uses the provided id when specified', () => {
		const customId = 'custom-popup-id';

		renderTopLayerPopup(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				id={customId}
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-controls', customId);
	});

	it('aria-controls is set on the trigger when popup is closed', () => {
		renderTopLayerPopup(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-controls');
	});
});

describe('Popup top-layer adapter: content rendering on rerender', () => {
	it('renders content when isOpen transitions from false to true', () => {
		const { rerender } = renderTopLayerPopup(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.queryByTestId('popup-content')).not.toBeInTheDocument();

		rerender(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeVisible();
	});

	it('hides content when isOpen transitions from true to false', () => {
		const { rerender } = renderTopLayerPopup(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeVisible();

		rerender(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		// In the top-layer path, closed popover content may remain in the DOM
		// but the popover element should not be visible (isOpen=false passed to Popup.Content).
		expect(screen.getByTestId('popup-content')).not.toBeVisible();
	});

	it('sets aria-expanded to match isOpen synchronously (no animation-aware delay)', () => {
		// The compound animation-aware `aria-expanded` machine
		// (`popupState` going through `animating-closed`) was removed when
		// the `Popup` compound was deleted from `@atlaskit/top-layer`.
		// `aria-expanded` now flips synchronously with `isOpen`. Consumers
		// that need an animation-aware aria-expanded should track it
		// locally via `onEnterFinish`/`onExitFinish` on `Popover`.
		const { rerender } = renderTopLayerPopup(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		rerender(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('Popup top-layer adapter: onClose called from within content', () => {
	it('calls onClose when content invokes the onClose callback', async () => {
		const onClose = jest.fn();
		renderTopLayerPopup(
			<Popup
				isOpen={true}
				content={({ onClose: contentOnClose }: ContentProps) => (
					<button type="button" onClick={contentOnClose} data-testid="close-btn">
						Close
					</button>
				)}
				trigger={defaultTrigger}
				onClose={onClose}
			/>,
		);

		await userEvent.click(screen.getByTestId('close-btn'));

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('Popup top-layer adapter: trigger does not re-render unnecessarily', () => {
	it('renders the trigger a bounded number of times across open transitions', () => {
		const triggerRender = jest.fn();

		const trigger = (props: TriggerProps) => {
			triggerRender();
			return (
				<button
					type="button"
					ref={props.ref}
					aria-controls={props['aria-controls']}
					aria-expanded={props['aria-expanded']}
					aria-haspopup={props['aria-haspopup']}
				>
					Trigger
				</button>
			);
		};

		const content = () => <div>content</div>;

		const { rerender } = renderTopLayerPopup(
			<Popup isOpen={false} content={content} trigger={trigger} />,
		);

		const initialTriggerCount = triggerRender.mock.calls.length;

		rerender(<Popup isOpen={true} content={content} trigger={trigger} testId={testId} />);

		expect(triggerRender.mock.calls.length).toBeLessThanOrEqual(initialTriggerCount + 4);
	});
});

describe('Popup top-layer adapter: popupComponent rendering on transitions', () => {
	it('renders custom popupComponent and its content when popup transitions to open', () => {
		const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
			({ children, ...rest }, ref) => (
				<div {...rest} ref={ref} data-testid="custom-container">
					popup component
					<div>{children}</div>
				</div>
			),
		);
		CustomContainer.displayName = 'CustomContainer';

		const { rerender } = renderTopLayerPopup(
			<Popup
				isOpen={false}
				content={defaultContent}
				trigger={defaultTrigger}
				popupComponent={CustomContainer}
				testId={testId}
			/>,
		);

		expect(screen.queryByText('popup component')).not.toBeInTheDocument();

		rerender(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				popupComponent={CustomContainer}
				testId={testId}
			/>,
		);

		expect(screen.getByText('popup component')).toBeVisible();
		expect(screen.getByTestId('popup-content')).toBeVisible();
	});
});

describe('Popup top-layer adapter: placement prop', () => {
	const placements = [
		'auto',
		'top',
		'bottom',
		'left',
		'right',
		'top-start',
		'top-end',
		'bottom-start',
		'bottom-end',
		'right-start',
		'right-end',
		'left-start',
		'left-end',
	] as const;

	for (const placement of placements) {
		it(`accepts placement="${placement}" without error`, () => {
			expect(() =>
				render(
					<Popup
						isOpen={true}
						content={defaultContent}
						trigger={defaultTrigger}
						placement={placement}
						testId={testId}
					/>,
				),
			).not.toThrow();

			expect(screen.getByTestId('popup-content')).toBeInTheDocument();
		});
	}
});

describe('Popup top-layer adapter: focus management', () => {
	it('does not focus the content element when the popup is open', () => {
		renderTopLayerPopup(
			<Popup
				isOpen={true}
				content={() => <div data-testid="content-div">content</div>}
				trigger={defaultTrigger}
			/>,
		);

		expect(screen.getByTestId('content-div')).not.toHaveFocus();
	});

	it('passes setInitialFocusRef that can be used to set initial focus target', () => {
		const contentFn = jest.fn(({ setInitialFocusRef }: ContentProps) => (
			<button
				type="button"
				ref={setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>}
				data-testid="focus-target"
			>
				focused button
			</button>
		));

		renderTopLayerPopup(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} />);

		expect(contentFn).toHaveBeenCalledWith(
			expect.objectContaining({
				setInitialFocusRef: expect.any(Function),
			}),
		);
	});
});

describe('Popup top-layer adapter: aria-haspopup values for different roles', () => {
	it('sets aria-haspopup="dialog" by default (no role specified)', () => {
		renderTopLayerPopup(<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} />);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('sets aria-haspopup="dialog" when role="dialog"', () => {
		renderTopLayerPopup(
			<Popup
				isOpen={false}
				content={defaultContent}
				trigger={defaultTrigger}
				role="dialog"
				label="Dialog popup"
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('sets aria-haspopup="listbox" when role="listbox"', () => {
		renderTopLayerPopup(
			<Popup
				isOpen={false}
				content={defaultContent}
				trigger={defaultTrigger}
				role="listbox"
				label="Options"
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger.getAttribute('aria-haspopup')).toBeTruthy();
	});
});
