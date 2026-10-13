import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import MotionPresenceBoundary from '@atlaskit/motion/motion-presence-boundary';
import { Popup } from '@atlaskit/popup/popup';
import TagGroup from '@atlaskit/tag-group/tag-group';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import AvatarTag from '../../../tag-new/avatar-tag';
import { TagMotion } from '../../../tag-new/tag-motion';
import { TagStatus } from '../../../tag-new/tag-status';
import Tag from '../../internal/removable';

function MotionProbe() {
	return (
		<TagMotion forwardedRef={null} hasMargin={false} status={TagStatus.Showing}>
			{({ ref, isEntering, isExiting }) => (
				<span
					ref={ref}
					data-testid="tag-motion"
					data-entering={isEntering}
					data-exiting={isExiting}
				>
					EAP
				</span>
			)}
		</TagMotion>
	);
}

describe('tag presence inside containers', () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(async () => {
		await act(async () => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it.each([false, true])('isolates popup entry with the boundary gate %s', async (enabled) => {
		(enabled ? passGate : failGate)('platform-dst-motion-isolate-presence');
		passGate('platform-dst-motion-uplift-popup');
		failGate('platform-dst-top-layer');
		const tree = (isOpen: boolean) => (
			<Popup
				isOpen={isOpen}
				placement="bottom-start"
				shouldRenderToParent
				autoFocus={false}
				content={() => <MotionProbe />}
				trigger={(props) => <button {...props}>More</button>}
			/>
		);
		const { rerender } = render(tree(false));
		rerender(tree(true));
		await act(() => Promise.resolve());
		expect(screen.getByTestId('tag-motion')).toHaveAttribute('data-entering', String(!enabled));
		rerender(tree(false));
		await act(() => Promise.resolve());
		if (enabled) {
			expect(screen.getByTestId('tag-motion')).toHaveAttribute('data-exiting', 'false');
		}
	});

	it.each(['tag', 'avatar'] as const)(
		'keeps initial %s group settled and animates only additions and removals',
		(variant) => {
			passGate('platform-dst-motion-isolate-presence');
			passGate('platform-dst-motion-uplift-labels');
			const tree = (items: string[]) => (
				<ExitingPersistence appear>
					<MotionPresenceBoundary>
						<TagGroup label="Selected tags">
							{items.map((text) =>
								variant === 'tag' ? (
									<Tag key={text} text={text} testId={text} />
								) : (
									<AvatarTag key={text} type="user" avatar={Avatar} text={text} testId={text} />
								),
							)}
						</TagGroup>
					</MotionPresenceBoundary>
				</ExitingPersistence>
			);
			const { rerender } = render(tree(['existing']));
			const settledClasses = screen.getByTestId('existing').className;
			rerender(tree(['existing', 'added']));
			expect(screen.getByTestId('existing')).toHaveClass(settledClasses, { exact: true });
			expect(screen.getByTestId('added')).not.toHaveClass(settledClasses, { exact: true });
			rerender(tree(['added']));
			expect(screen.getByTestId('existing')).not.toHaveClass(settledClasses, { exact: true });
			act(() => jest.runAllTimers());
			expect(screen.queryByTestId('existing')).not.toBeInTheDocument();
			expect(screen.getByTestId('added')).toBeInTheDocument();
		},
	);

	it('still completes a tag removal immediately with reduced motion', () => {
		passGate('platform-dst-motion-isolate-presence');
		passGate('platform-dst-motion-uplift-labels');
		jest.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
		const onAfterRemoveAction = jest.fn();
		render(
			<MotionPresenceBoundary>
				<Tag text="Reduced" testId="reduced" onAfterRemoveAction={onAfterRemoveAction} />
			</MotionPresenceBoundary>,
		);
		act(() => screen.getByTestId('close-button-reduced').click());
		expect(screen.queryByTestId('reduced')).not.toBeInTheDocument();
		expect(onAfterRemoveAction).toHaveBeenCalledWith('Reduced');
	});
});
