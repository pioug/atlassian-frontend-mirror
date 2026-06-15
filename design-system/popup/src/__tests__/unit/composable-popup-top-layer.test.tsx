/* eslint-disable testing-library/no-node-access */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Popup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';

afterEach(() => {
	jest.clearAllMocks();
});

const testId = 'popup';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: trigger rendering', () => {
	it('renders the trigger element', () => {
		render(
			<Popup>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
	});

	it('sets aria-expanded=false when closed', () => {
		render(
			<Popup>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
	});

	it('sets aria-expanded=true when open', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId}>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: content rendering', () => {
	it('renders content when open', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId}>{() => <div data-testid="inner">content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.getByTestId('inner')).toBeInTheDocument();
	});

	it('does not render content when closed', () => {
		render(
			<Popup>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId}>{() => <div data-testid="inner">content</div>}</PopupContent>
			</Popup>,
		);

		expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: WCAG 4.1.2 — role', () => {
	it('does not apply a role when none is supplied (legacy `Popup` contract)', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId}>{() => <div>content</div>}</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		// Legacy `Popup` left the popup role-less when no `role` was
		// passed. We preserve that contract: no implicit `dialog`
		// default, no role-based initial focus movement.
		expect(content).not.toHaveAttribute('role');
	});

	it('applies role="menu" when specified', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} role="menu">
					{() => <div>content</div>}
				</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'menu');
	});

	it('applies aria-labelledby when titleId is provided alongside a dialog role', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} role="dialog" titleId="popup-title">
					{() => (
						<div>
							<h2 id="popup-title">Title</h2>
							content
						</div>
					)}
				</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-labelledby', 'popup-title');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: WCAG 1.3.2 — DOM order', () => {
	it('renders content in DOM order (not portalled)', () => {
		const { container } = render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId}>{() => <div data-testid="inner">content</div>}</PopupContent>
			</Popup>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const content = screen.getByTestId('inner');

		expect(container).toContainElement(trigger);
		expect(container).toContainElement(content);

		const position = trigger.compareDocumentPosition(content);
		expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: onClose callback', () => {
	it('passes onClose to the content render prop', () => {
		const onClose = jest.fn();
		const contentFn = jest.fn((props) => {
			expect(props.onClose).toBe(onClose);
			return <div>content</div>;
		});

		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} onClose={onClose}>
					{contentFn}
				</PopupContent>
			</Popup>,
		);

		expect(contentFn).toHaveBeenCalled();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: shouldFitContainer', () => {
	it('renders content when shouldFitContainer is true', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} shouldFitContainer>
					{() => <div data-testid="inner">content</div>}
				</PopupContent>
			</Popup>,
		);

		expect(screen.getByTestId('inner')).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: shouldFitViewport', () => {
	it('renders content when shouldFitViewport is true', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} shouldFitViewport>
					{() => <div data-testid="inner">content</div>}
				</PopupContent>
			</Popup>,
		);

		expect(screen.getByTestId('inner')).toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: label prop', () => {
	it('applies custom label to dialog role', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} label="Custom label">
					{() => <div>content</div>}
				</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('aria-label', 'Custom label');
	});

	it('applies custom label to menu role', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} role="menu" label="Navigation menu">
					{() => <div>content</div>}
				</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		expect(content).toHaveAttribute('role', 'menu');
		expect(content).toHaveAttribute('aria-label', 'Navigation menu');
	});

	it('defaults to "Popup" label when role="dialog" is supplied without a custom label', () => {
		render(
			<Popup isOpen>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent testId={testId} role="dialog">
					{() => <div>content</div>}
				</PopupContent>
			</Popup>,
		);

		const content = screen.getByTestId(`${testId}--content`);
		// `dialog` requires an accessible name. The bridge supplies
		// "Popup" as a fallback when the consumer does not provide one.
		expect(content).toHaveAttribute('aria-label', 'Popup');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Composable Popup top-layer: no-op props accepted', () => {
	it('accepts zIndex without error', () => {
		expect(() =>
			render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								Trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent zIndex={9999}>{() => <div>content</div>}</PopupContent>
				</Popup>,
			),
		).not.toThrow();
	});

	it('accepts shouldRenderToParent without error', () => {
		expect(() =>
			render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								Trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent shouldRenderToParent>{() => <div>content</div>}</PopupContent>
				</Popup>,
			),
		).not.toThrow();
	});

	it('accepts strategy without error', () => {
		expect(() =>
			render(
				<Popup>
					<PopupTrigger>
						{(triggerProps) => (
							<button type="button" {...triggerProps}>
								Trigger
							</button>
						)}
					</PopupTrigger>
					<PopupContent strategy="fixed">{() => <div>content</div>}</PopupContent>
				</Popup>,
			),
		).not.toThrow();
	});
});
