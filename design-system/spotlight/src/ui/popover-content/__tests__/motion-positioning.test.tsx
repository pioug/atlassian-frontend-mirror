import React, { type ReactNode, useRef } from 'react';

import '@atlaskit/top-layer/testing/polyfill';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';

import { SpotlightContextProvider } from '../../../controllers/context';
import { SpotlightCard } from '../../card';
import { SpotlightHeadline } from '../../headline';
import { PopoverContent, type PopoverContentProps } from '../index';

// Exercise the real CSS positioning hook in jsdom.
(window as unknown as { CSS: { supports: () => boolean } }).CSS = {
	supports: () => true,
};

const FirstMotion = ({ children }: { children: ReactNode }) => <div>{children}</div>;
const SecondMotion = ({ children }: { children: ReactNode }) => <section>{children}</section>;
const dismiss = () => undefined;

function Example({
	motion = FirstMotion,
	isVisible = true,
}: {
	motion?: PopoverContentProps['motion'];
	isVisible?: boolean;
}) {
	const targetRef = useRef<HTMLButtonElement>(null);
	return (
		<>
			<button ref={targetRef} data-testid="target">
				Target
			</button>
			<SpotlightContextProvider targetRef={targetRef}>
				<PopoverContent
					dismiss={dismiss}
					placement="bottom-start"
					motion={motion}
					isVisible={isVisible}
					testId="popover"
				>
					<SpotlightCard>
						<SpotlightHeadline>Headline</SpotlightHeadline>
					</SpotlightCard>
				</PopoverContent>
			</SpotlightContextProvider>
		</>
	);
}

function expectPositioned() {
	const anchorName = screen.getByTestId('target').style.getPropertyValue('anchor-name');
	expect(anchorName).not.toBe('');
	expect(screen.getByTestId('popover').style.getPropertyValue('position-anchor')).toBe(anchorName);
}

beforeEach(() => {
	passGate('platform-dst-motion-uplift-spotlight');
});

it('positions an external target after the motion wrapper is ready', () => {
	render(<Example />);
	expectPositioned();
});

it('repositions when the motion wrapper changes', () => {
	const { rerender } = render(<Example />);
	rerender(<Example motion={SecondMotion} />);
	expectPositioned();
});

it('repositions after closing and reopening', async () => {
	const { rerender } = render(<Example />);
	const popover = screen.getByTestId('popover');
	rerender(<Example isVisible={false} />);
	await waitFor(() => expect(popover).not.toBeInTheDocument());
	rerender(<Example />);
	expectPositioned();
});
