import React, { useState } from 'react';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import Tag from '@atlaskit/tag/removable-tag';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Box
			padding="space.100"
			onAnimationStart={(event: React.AnimationEvent<HTMLDivElement>) => {
				const target = event.target;
				if (target instanceof HTMLElement && target.textContent === 'Prefetch QA component') {
					event.currentTarget.dataset.tagEnteringOverflow = getComputedStyle(target).overflow;
				}
			}}
		>
			<button type="button">Start keyboard navigation</button>
			<p>
				<ExitingPersistence appear>
					<Tag
						text="Prefetch QA component"
						testId="keyboard-focus"
						href="/components/tag"
						hasMargin={false}
						isRemovable={false}
					/>
				</ExitingPersistence>
			</p>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={() => (
					<Box padding="space.100">
						<Tag
							text="Second component"
							testId="popup-focus"
							href="/components/second"
							hasMargin={false}
							isRemovable={false}
						/>
					</Box>
				)}
				trigger={(triggerProps) => (
					<button
						{...triggerProps}
						type="button"
						aria-label="Show more components"
						onClick={() => setIsOpen((value) => !value)}
					>
						+1
					</button>
				)}
			/>
		</Box>
	);
};
