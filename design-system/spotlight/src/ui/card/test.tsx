import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen } from '@atlassian/testing-library';


import { SpotlightContext } from '../../controllers/context';
import type { Placement } from '../../types';

import { SpotlightCard } from './index';

const testId = 'SpotlightCard';

const renderWithPlacement = (placement: Placement) =>
	render(
		<SpotlightContext.Provider
			value={{
				card: {
					ref: null,
					setRef: () => undefined,
					placement,
					setPlacement: () => undefined,
					motion: undefined,
					setMotion: () => undefined,
				},
				heading: {
					id: 'heading',
					setId: () => undefined,
				},
				popoverContent: {
					ref: undefined,
					setRef: () => undefined,
					positionArea: undefined,
					setPositionArea: () => undefined,
					update: () => Promise.resolve(),
					setUpdate: () => undefined,
					dismiss: { current: () => undefined },
					setDismiss: () => undefined,
				},
				target: {
					ref: { current: null },
					setRef: () => undefined,
				},
				primaryAction: {
					action: { current: () => undefined },
					setAction: () => undefined,
				},
				secondaryAction: {
					action: { current: () => undefined },
					setAction: () => undefined,
				},
			}}
		>
			<SpotlightCard testId={testId}>Hello, world!</SpotlightCard>
		</SpotlightContext.Provider>,
	);

describe('SpotlightCard', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightCard testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds SpotlightCard by its testid', async () => {
		render(<SpotlightCard testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightCard ref={ref}>Hello, world!</SpotlightCard>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});

	ffTest.on('platform-dst-top-layer', 'with top-layer card layout enabled', () => {
		it.each<Placement>([
			'top-start',
			'top-center',
			'top-end',
			'bottom-start',
			'bottom-center',
			'bottom-end',
			'right-start',
			'right-end',
			'left-start',
			'left-end',
		])('renders the existing caret visual for %s', (placement) => {
			renderWithPlacement(placement);

			expect(screen.getByTestId(testId)).toHaveTextContent('Hello, world!');
		});
	});
});
