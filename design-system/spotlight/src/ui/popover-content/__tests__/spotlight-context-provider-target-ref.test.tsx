import React, { useRef } from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { SpotlightContextProvider } from '../../../entry-points/spotlight-context-provider';
import {
	PopoverContent,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightHeader,
	SpotlightHeadline,
} from '../../../index';

// `var` (rather than `let`) so the mock factory below — which Jest hoists
// above this declaration — can still resolve the binding.
// eslint-disable-next-line no-var
var mockUseAnchorPositionArgs: jest.Mock;

jest.mock('@atlaskit/top-layer/use-anchor-position', () => {
	mockUseAnchorPositionArgs = jest.fn();
	return {
		useAnchorPosition: (args: unknown) => {
			mockUseAnchorPositionArgs(args);
		},
	};
});

jest.mock('@atlaskit/top-layer/popover', () => {
	const React = require('react');
	const actual = jest.requireActual('@atlaskit/top-layer/popover');

	return {
		...actual,
		Popover: React.forwardRef(
			(
				{
					children,
					isOpen,
					labelledBy,
					mode,
					role,
					testId,
				}: {
					children: React.ReactNode;
					isOpen: boolean;
					labelledBy?: string;
					mode?: string;
					role?: string;
					testId?: string;
				},
				ref: React.Ref<HTMLDivElement>,
			) => {
				return React.createElement(
					'div',
					{
						ref,
						role,
						'aria-labelledby': labelledBy,
						'data-testid': testId,
						'data-popover-mode': mode,
						'data-popover-open': String(isOpen),
					},
					children,
				);
			},
		),
	};
});

/**
 * Renders `PopoverContent` inside an externally-supplied
 * `SpotlightContextProvider` whose `targetRef` points to a sibling element
 * that lives outside `PopoverTarget`. This mirrors the Post Office use case
 * where the message and the visual anchor live in different React subtrees.
 */
const TargetRefSeededProvider = ({
	dismiss,
	shouldDismissOnClickOutside,
	offset,
}: {
	dismiss: (event: any) => void;
	shouldDismissOnClickOutside?: boolean;
	offset?: [number, number];
}) => {
	const anchorRef = useRef<HTMLDivElement>(null);
	return (
		<>
			<div data-testid="external-target" ref={anchorRef}>
				Target
			</div>
			<SpotlightContextProvider targetRef={anchorRef}>
				<PopoverContent
					dismiss={dismiss}
					placement="bottom-end"
					testId="spotlight-popover-content"
					shouldDismissOnClickOutside={shouldDismissOnClickOutside}
					offset={offset}
				>
					<SpotlightCard>
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl testId="dismiss-control" />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Content</Text>
						</SpotlightBody>
					</SpotlightCard>
				</PopoverContent>
			</SpotlightContextProvider>
		</>
	);
};

describe('SpotlightContextProvider — targetRef', () => {
	beforeEach(() => {
		mockUseAnchorPositionArgs?.mockClear();
	});

	ffTest.on('platform-dst-top-layer-spotlight', 'with top-layer positioning enabled', () => {
		it('renders without a surrounding <PopoverProvider>/<PopoverTarget>', () => {
			render(<TargetRefSeededProvider dismiss={() => undefined} />);

			expect(screen.getByTestId('spotlight-popover-content')).toBeInTheDocument();
			expect(screen.getByTestId('spotlight-popover-content')).toHaveAttribute(
				'data-popover-open',
				'true',
			);
		});

		it('forwards the supplied targetRef into useAnchorPosition via the context', () => {
			render(<TargetRefSeededProvider dismiss={() => undefined} />);

			const externalTarget = screen.getByTestId('external-target');
			const lastCall = mockUseAnchorPositionArgs.mock.calls.at(-1)?.[0];

			expect(lastCall).toBeDefined();
			expect(lastCall.anchorRef).toBeDefined();
			expect(lastCall.anchorRef.current).toBe(externalTarget);
			expect(lastCall.popoverRef).toBeDefined();
			expect(lastCall.placement).toBeDefined();
		});

		it('passes the merged top-layer placement into useAnchorPosition', () => {
			render(<TargetRefSeededProvider dismiss={() => undefined} offset={[6, 8]} />);

			const lastCall = mockUseAnchorPositionArgs.mock.calls.at(-1)?.[0];

			expect(lastCall.placement).toEqual(
				expect.objectContaining({
					axis: 'block',
					edge: 'end',
					align: 'start',
					offset: {
						gap: expect.stringContaining('+ 8px'),
						crossAxisShift: {
							value: expect.stringContaining('+ 6px'),
							direction: 'forwards',
						},
					},
				}),
			);
		});

		it('SpotlightDismissControl still dismisses (provider wires popoverContent.setDismiss)', async () => {
			const mockDismiss = jest.fn();
			const user = userEvent.setup();

			render(<TargetRefSeededProvider dismiss={mockDismiss} />);

			await user.click(screen.getByTestId('dismiss-control'));

			expect(mockDismiss).toHaveBeenCalledTimes(1);
		});

		it('Escape still dismisses with the externally-supplied SpotlightContext', async () => {
			const mockDismiss = jest.fn();
			const user = userEvent.setup();

			render(<TargetRefSeededProvider dismiss={mockDismiss} />);

			await user.keyboard('{Escape}');

			expect(mockDismiss).toHaveBeenCalledWith(
				expect.objectContaining({ key: 'Escape', type: 'keydown' }),
			);
		});
	});
});
