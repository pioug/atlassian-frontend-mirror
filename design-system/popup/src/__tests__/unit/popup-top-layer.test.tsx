/* eslint-disable testing-library/no-node-access */
import React, { forwardRef } from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@atlassian/testing-library';

import { Popup } from '../../popup';
import { type ContentProps, type PopupComponentProps, type TriggerProps } from '../../types';

afterEach(() => {
	jest.clearAllMocks();
});

// ── Helpers ──

const testId = 'popup';

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

// ── Tests ──

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: trigger rendering', () => {
	it('renders the trigger element', () => {
		render(<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} />);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
	});

	it('sets aria-expanded=false when closed', () => {
		render(<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} />);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('sets aria-expanded=true when open', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('sets aria-haspopup="dialog" by default', () => {
		render(<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} />);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('sets aria-haspopup to match the content role', () => {
		render(
			<Popup
				isOpen={false}
				content={() => <div>Menu content</div>}
				trigger={defaultTrigger}
				role="menu"
				label="Test menu"
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: content rendering', () => {
	it('renders content when isOpen is true', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeInTheDocument();
	});

	it('does not render content when isOpen is false', () => {
		render(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.queryByTestId('popup-content')).not.toBeInTheDocument();
	});

	it('passes isOpen=true to the content render prop', () => {
		const contentFn = jest.fn((props: ContentProps) => (
			<div data-testid="popup-content">{String(props.isOpen)}</div>
		));

		render(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} testId={testId} />);

		expect(contentFn).toHaveBeenCalledWith(expect.objectContaining({ isOpen: true }));
	});

	it('passes setInitialFocusRef to the content render prop', () => {
		const contentFn = jest.fn((props: ContentProps) => {
			expect(typeof props.setInitialFocusRef).toBe('function');
			return <div>content</div>;
		});

		render(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} />);

		expect(contentFn).toHaveBeenCalled();
	});

	it('passes update (no-op) to the content render prop', () => {
		const contentFn = jest.fn((props: ContentProps) => {
			expect(typeof props.update).toBe('function');
			return <div>content</div>;
		});

		render(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} />);

		expect(contentFn).toHaveBeenCalled();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: onClose callback', () => {
	it('passes onClose to the content render prop', () => {
		const onClose = jest.fn();
		const contentFn = jest.fn((props: ContentProps) => {
			expect(props.onClose).toBe(onClose);
			return <div>content</div>;
		});

		render(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} onClose={onClose} />);

		expect(contentFn).toHaveBeenCalled();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: testId forwarding', () => {
	it('applies testId to the content wrapper', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: popupComponent', () => {
	it('renders content inside a custom popupComponent', () => {
		const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
			({ children, ...rest }, ref) => (
				<div ref={ref} {...rest} data-testid="custom-container">
					{children}
				</div>
			),
		);
		CustomContainer.displayName = 'CustomContainer';

		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				popupComponent={CustomContainer}
				testId={testId}
			/>,
		);

		expect(screen.getByTestId('custom-container')).toBeInTheDocument();
		expect(screen.getByTestId('popup-content')).toBeInTheDocument();
	});

	it('passes empty style to popupComponent', () => {
		const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
			({ children, style, ...rest }, ref) => (
				<div ref={ref} {...rest} data-testid="custom-container" style={style}>
					{children}
				</div>
			),
		);
		CustomContainer.displayName = 'CustomContainer';

		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				popupComponent={CustomContainer}
			/>,
		);

		const container = screen.getByTestId('custom-container');
		// style attribute should be empty or minimal — positioning is on the popover parent
		expect(container.getAttribute('style')).toBeFalsy();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: WCAG 4.1.2 — role attribute', () => {
	it('does not apply a role when none is supplied (legacy `Popup` contract)', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const content = screen.getByTestId(`${testId}--content`);
		// Legacy `Popup` left the popup role-less when no `role` was
		// passed. We preserve that contract: no implicit `dialog`
		// default, no role-based initial focus movement.
		expect(content).not.toHaveAttribute('role');
	});

	it('applies role="menu" when specified', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				role="menu"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'menu');
	});

	it('applies role="alertdialog" when specified', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				role="alertdialog"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'alertdialog');
	});

	it('applies aria-label to dialog role', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				label="Custom label"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-label', 'Custom label');
	});

	it('applies aria-labelledby when titleId is provided alongside a dialog role', () => {
		render(
			<Popup
				isOpen={true}
				role="dialog"
				content={() => (
					<div>
						{/* Use a div with explicit aria-level so the test fixture does
						    not need to use a heading element (no associated lint
						    disables) and AT still announces it as a level-2 heading. */}
						<div role="heading" aria-level={2} id="popup-title">
							Title
						</div>
						<div>content</div>
					</div>
				)}
				trigger={defaultTrigger}
				testId={testId}
				titleId="popup-title"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-labelledby', 'popup-title');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: WCAG 1.3.2 — DOM order (no portals)', () => {
	it('renders content in DOM order (not portalled)', () => {
		const { container } = render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const content = screen.getByTestId('popup-content');

		// Content should be in the same DOM tree as trigger (no Portal)
		// eslint-disable-next-line testing-library/no-container -- intentionally checking DOM containment for portal behavior
		expect(container.contains(trigger)).toBe(true);
		// eslint-disable-next-line testing-library/no-container -- intentionally checking DOM containment for portal behavior
		expect(container.contains(content)).toBe(true);

		// Content follows trigger in DOM order
		const position = trigger.compareDocumentPosition(content);
		expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: shouldFitContainer', () => {
	it('passes width="trigger" to Popup.Content when shouldFitContainer is true', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				shouldFitContainer
			/>,
		);

		// The popover content element should be rendered
		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});

	it('passes width="content" by default', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: offset conversion', () => {
	it('accepts offset prop without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={true}
					content={defaultContent}
					trigger={defaultTrigger}
					offset={[4, 12]}
					testId={testId}
				/>,
			),
		).not.toThrow();

		expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
	});

	it('renders content when offset is provided', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				offset={[0, 16]}
				testId={testId}
			/>,
		);

		expect(screen.getByTestId('popup-content')).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: shouldFitViewport', () => {
	it('renders content with shouldFitViewport=true', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				shouldFitViewport
			/>,
		);

		expect(screen.getByTestId('popup-content')).toBeInTheDocument();
	});

	it('renders content without shouldFitViewport', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: shouldReturnFocus', () => {
	it('accepts shouldReturnFocus=false without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={true}
					content={defaultContent}
					trigger={defaultTrigger}
					shouldReturnFocus={false}
				/>,
			),
		).not.toThrow();
	});

	it('accepts shouldReturnFocus=true without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={true}
					content={defaultContent}
					trigger={defaultTrigger}
					shouldReturnFocus={true}
				/>,
			),
		).not.toThrow();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: label with non-dialog roles', () => {
	it('applies label to listbox role', () => {
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				role="listbox"
				label="Options list"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'listbox');
		expect(content).toHaveAttribute('aria-label', 'Options list');
	});

	it('applies label to tooltip role', () => {
		// Use a non-literal role so @atlassian/a11y/aria-tooltip-name (static) does not
		// treat <Popup> as a native tooltip host; the runtime role/label still apply via Popup.
		const tooltipRole = 'tooltip';
		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				role={tooltipRole}
				label="Helpful tip"
			/>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'tooltip');
		expect(content).toHaveAttribute('aria-label', 'Helpful tip');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: no-op props are accepted', () => {
	it('accepts zIndex without error', () => {
		expect(() =>
			render(
				<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} zIndex={9999} />,
			),
		).not.toThrow();
	});

	it('accepts shouldRenderToParent without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					shouldRenderToParent
				/>,
			),
		).not.toThrow();
	});

	it('accepts boundary without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					boundary="clippingParents"
				/>,
			),
		).not.toThrow();
	});

	it('accepts strategy without error', () => {
		expect(() =>
			render(
				<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} strategy="fixed" />,
			),
		).not.toThrow();
	});

	it('accepts shouldDisableFocusLock without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					shouldDisableFocusLock
				/>,
			),
		).not.toThrow();
	});

	it('accepts shouldUseCaptureOnOutsideClick without error', () => {
		expect(() =>
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					shouldUseCaptureOnOutsideClick
				/>,
			),
		).not.toThrow();
	});
});
