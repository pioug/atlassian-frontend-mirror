import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen } from '@atlassian/testing-library';

import { Manager, Popper, Reference } from '../../index';

// Top-layer renders use the native Popover API, which jsdom does not
// implement. Stub the methods we touch so tests never hit unimplemented
// browser code paths.
beforeAll(() => {
	if (!(HTMLElement.prototype as unknown as { showPopover?: () => void }).showPopover) {
		(HTMLElement.prototype as unknown as { showPopover: () => void }).showPopover =
			function showPopover() {};
		(HTMLElement.prototype as unknown as { hidePopover: () => void }).hidePopover =
			function hidePopover() {};
		(HTMLElement.prototype as unknown as { togglePopover: () => void }).togglePopover =
			function togglePopover() {};
	}
});

function createReferenceButton(): HTMLButtonElement {
	const reference = document.createElement('button');
	reference.setAttribute('aria-label', 'reference anchor');
	document.body.appendChild(reference);
	return reference;
}

afterEach(() => {
	document.body.innerHTML = '';
});

// Covered by the dedicated `accessibility.test.tsx` in this folder; the
// suite below exercises FF-on adapter wiring behaviour rather than a11y.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Popper FF-on top-layer adapter', () => {
	it('passes inert style / arrowProps.style and verbatim placement to children', () => {
		passGate('platform-dst-top-layer');

		const reference = createReferenceButton();

		let captured: {
			ref: unknown;
			style: unknown;
			placement: unknown;
			arrowProps: { style: unknown };
		} | null = null;

		render(
			<Popper referenceElement={reference} placement="top-end">
				{({ ref, style, placement, arrowProps }) => {
					captured = { ref, style, placement, arrowProps };
					return <div ref={ref as React.Ref<HTMLDivElement>}>popover content</div>;
				}}
			</Popper>,
		);

		expect(captured).not.toBeNull();
		expect(captured!.placement).toBe('top-end');
		expect(captured!.style).toEqual({});
		expect(captured!.arrowProps.style).toEqual({});
		expect(typeof captured!.ref).toBe('function');
	});

	it('renders nothing visible when no referenceElement and no Manager anchor', () => {
		passGate('platform-dst-top-layer');

		render(
			<Popper>
				{({ ref }) => (
					<div ref={ref as React.Ref<HTMLDivElement>} data-testid="popover-content">
						x
					</div>
				)}
			</Popper>,
		);

		// Popover with isOpen=false; the surface is not in the document.
		expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
	});

	it('reads anchor from <Manager>/<Reference> context when no referenceElement', () => {
		passGate('platform-dst-top-layer');

		render(
			<Manager>
				<Reference>
					{({ ref }) => (
						<button
							ref={ref as React.Ref<HTMLButtonElement>}
							type="button"
							data-testid="ref-btn"
							aria-label="trigger"
						>
							trigger
						</button>
					)}
				</Reference>
				<Popper>
					{({ ref }) => (
						<div ref={ref as React.Ref<HTMLDivElement>} data-testid="popper-content">
							content
						</div>
					)}
				</Popper>
			</Manager>,
		);

		// The popover surface mounts once the reference is published via
		// `<Reference>`'s context.
		expect(screen.getByTestId('popper-content')).toBeInTheDocument();
	});

	it('silently ignores the modifiers prop and does not warn', () => {
		passGate('platform-dst-top-layer');
		const warn = jest.spyOn(console, 'warn').mockImplementation(__noop);

		const reference = createReferenceButton();

		render(
			<Popper referenceElement={reference} modifiers={[{ name: 'noop', enabled: true }]}>
				{({ ref }) => <div ref={ref as React.Ref<HTMLDivElement>}>x</div>}
			</Popper>,
		);

		expect(warn).not.toHaveBeenCalled();

		warn.mockRestore();
	});

	it('returns stable update and forceUpdate identities across re-renders', () => {
		passGate('platform-dst-top-layer');

		const reference = createReferenceButton();

		const captured: { update: unknown[]; forceUpdate: unknown[] } = {
			update: [],
			forceUpdate: [],
		};

		const { rerender } = render(
			<Popper referenceElement={reference}>
				{({ ref, update, forceUpdate }) => {
					captured.update.push(update);
					captured.forceUpdate.push(forceUpdate);
					return <div ref={ref as React.Ref<HTMLDivElement>}>x</div>;
				}}
			</Popper>,
		);

		rerender(
			<Popper referenceElement={reference}>
				{({ ref, update, forceUpdate }) => {
					captured.update.push(update);
					captured.forceUpdate.push(forceUpdate);
					return <div ref={ref as React.Ref<HTMLDivElement>}>x</div>;
				}}
			</Popper>,
		);

		// Identity must be preserved across renders so consumers that
		// place these in useEffect dep arrays do not see spurious re-runs.
		expect(captured.update.length).toBeGreaterThanOrEqual(2);
		expect(captured.update[0]).toBe(captured.update[captured.update.length - 1]);
		expect(captured.forceUpdate[0]).toBe(captured.forceUpdate[captured.forceUpdate.length - 1]);
	});

	it('silently ignores the strategy prop and does not warn', () => {
		passGate('platform-dst-top-layer');
		const warn = jest.spyOn(console, 'warn').mockImplementation(__noop);

		const reference = createReferenceButton();

		render(
			<Popper referenceElement={reference} strategy="absolute">
				{({ ref }) => <div ref={ref as React.Ref<HTMLDivElement>}>x</div>}
			</Popper>,
		);

		expect(warn).not.toHaveBeenCalled();

		warn.mockRestore();
	});

	// Virtual-element anchor branch (`useAnchorPositionAtPoint`). The
	// legacy branch is covered by `unit/index.tsx`; this asserts the
	// FF-on adapter accepts a `VirtualElement` and renders the popover
	// surface (i.e. `isOpen` is derived from a non-null virtual ref).
	it('renders the popover surface when referenceElement is a VirtualElement', () => {
		passGate('platform-dst-top-layer');

		const virtual = {
			getBoundingClientRect(): DOMRect {
				return {
					top: 10,
					left: 10,
					right: 100,
					bottom: 30,
					width: 90,
					height: 20,
					x: 10,
					y: 10,
					toJSON: __noop,
				};
			},
		};

		render(
			<Popper referenceElement={virtual}>
				{({ ref }) => (
					<div ref={ref as React.Ref<HTMLDivElement>} data-testid="virtual-popper-content">
						content
					</div>
				)}
			</Popper>,
		);

		expect(screen.getByTestId('virtual-popper-content')).toBeInTheDocument();
	});
});
