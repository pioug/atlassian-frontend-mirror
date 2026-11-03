/* eslint-disable testing-library/no-node-access */

import React from 'react';

import { cssMap } from '@atlaskit/css';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Popup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';

afterEach(() => {
	jest.clearAllMocks();
});

const testId = 'popup';

const styles = cssMap({
	fixedWidth: {
		width: '280px',
	},
});

describe('Composable Popup top-layer: trigger rendering', () => {
	it('renders the trigger element', () => {
		passGate('platform-dst-top-layer');

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
		passGate('platform-dst-top-layer');

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
		passGate('platform-dst-top-layer');

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

describe('Composable Popup top-layer: content rendering', () => {
	it('renders content when open', () => {
		passGate('platform-dst-top-layer');

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
		passGate('platform-dst-top-layer');

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

describe('Composable Popup top-layer: WCAG 4.1.2 — role', () => {
	it('does not apply a role when none is supplied (legacy `Popup` contract)', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		// Legacy `Popup` left the popup role-less when no `role` was
		// passed. We preserve that contract: no implicit `dialog`
		// default, no role-based initial focus movement.
		expect(content).not.toHaveAttribute('role');
	});

	it('applies role="menu" when specified', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		expect(content).toHaveAttribute('role', 'menu');
	});

	it('applies aria-labelledby when titleId is provided alongside a dialog role', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		expect(content).toHaveAttribute('aria-labelledby', 'popup-title');
	});
});

it('renders content in DOM order (not portalled)', () => {
	passGate('platform-dst-top-layer');

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

it('passes onClose to the content render prop', () => {
	passGate('platform-dst-top-layer');

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

it('applies xcss to the element wrapping the content', () => {
	passGate('platform-dst-top-layer');

	render(
		<Popup isOpen>
			<PopupTrigger>
				{(triggerProps) => (
					<button type="button" {...triggerProps}>
						Trigger
					</button>
				)}
			</PopupTrigger>
			<PopupContent testId={testId} xcss={styles.fixedWidth}>
				{() => <div data-testid="inner">content</div>}
			</PopupContent>
		</Popup>,
	);

	// `xcss` lands on a wrapper inside `PopoverSurface`, so it is the content's
	// parent and not the `--container` popover host.
	const wrapper = screen.getByTestId('inner').parentElement;
	expect(wrapper).not.toBe(screen.getByTestId(`${testId}--container`));
	expect(wrapper).toHaveCompiledCss('width', '280px');
});

it('renders content when shouldFitContainer is true', () => {
	passGate('platform-dst-top-layer');

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

it('renders content when shouldFitViewport is true', () => {
	passGate('platform-dst-top-layer');

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

describe('Composable Popup top-layer: label prop', () => {
	it('applies custom label to dialog role', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		expect(content).toHaveAttribute('aria-label', 'Custom label');
	});

	it('applies custom label to menu role', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		expect(content).toHaveAttribute('role', 'menu');
		expect(content).toHaveAttribute('aria-label', 'Navigation menu');
	});

	it('defaults to "Popup" label when role="dialog" is supplied without a custom label', () => {
		passGate('platform-dst-top-layer');

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

		const content = screen.getByTestId(`${testId}--container`);
		// `dialog` requires an accessible name. The bridge supplies
		// "Popup" as a fallback when the consumer does not provide one.
		expect(content).toHaveAttribute('aria-label', 'Popup');
	});
});

describe('Composable Popup top-layer: no-op props accepted', () => {
	it('accepts zIndex without error', () => {
		passGate('platform-dst-top-layer');

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
		passGate('platform-dst-top-layer');

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
		passGate('platform-dst-top-layer');

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
