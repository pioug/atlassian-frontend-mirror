import React, { type ReactNode, useContext, useLayoutEffect, useMemo } from 'react';

import { render, screen } from '@testing-library/react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import UFOInteractionIgnore from '../index';

describe('UFO Interaction Ignore', () => {
	const testInteractionContext: InteractionContextType = {
		hold: jest.fn(),
		tracePress: jest.fn(),
	};

	let mountCounter = 1;
	function MyChildComponentWithMountCounter() {
		const myIncrement = useMemo(() => mountCounter++, []);
		return <div data-testid="my-child-component">{myIncrement}</div>;
	}

	function SimpleHold({ children }: { children?: ReactNode }) {
		const context = useContext(InteractionContext);

		useLayoutEffect(() => {
			if (context != null) {
				return context.hold('simple-hold');
			}
		}, [context]);

		// react-18: can return children directly
		return children != null ? <>{children}</> : null;
	}

	function MyFixtureComponent({ ignore }: { ignore: boolean }) {
		return (
			<UFOInteractionIgnore ignore={ignore}>
				<MyChildComponentWithMountCounter />
				<SimpleHold />
			</UFOInteractionIgnore>
		);
	}

	function MyFixtureComponentWithInteractionContext({ ignore }: { ignore: boolean }) {
		return (
			<InteractionContext.Provider value={testInteractionContext}>
				<MyFixtureComponent ignore={ignore} />
			</InteractionContext.Provider>
		);
	}

	beforeEach(() => {
		mountCounter = 1;
		jest.resetAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<MyFixtureComponent ignore={true} />);

		await expect(container).toBeAccessible();
	});

	it('renders the children when there is no interaction context', () => {
		const { rerender } = render(<MyFixtureComponent ignore={true} />);

		expect(screen.getByText('1')).not.toBeNull();
		expect(testInteractionContext.hold).not.toHaveBeenCalled();

		rerender(<MyFixtureComponent ignore={false} />);
		expect(screen.getByText('1')).not.toBeNull();
		expect(testInteractionContext.hold).not.toHaveBeenCalled();
	});

	it('renders the children when there is interaction context', () => {
		const { rerender } = render(<MyFixtureComponentWithInteractionContext ignore={true} />);

		expect(screen.getByText('1')).not.toBeNull();
		expect(testInteractionContext.hold).not.toHaveBeenCalled();

		rerender(<MyFixtureComponentWithInteractionContext ignore={false} />);
		expect(screen.getByText('1')).not.toBeNull();
		expect(testInteractionContext.hold).toHaveBeenCalled();
	});
});
