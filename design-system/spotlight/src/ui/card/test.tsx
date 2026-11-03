import React from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

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
		passGate('platform-dst-top-layer-spotlight');

		renderWithPlacement(placement);

		expect(screen.getByTestId(testId)).toHaveTextContent('Hello, world!');
	});
});
