/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import ArrowRight from '@atlaskit/icon/core/arrow-right';
import MenuIcon from '@atlaskit/icon/core/menu';
import { ButtonItem, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const nestedPopupStyles = cssMap({
	root: {
		maxWidth: '800px',
		minWidth: '320px',
	},
});

const spacerStyles = cssMap({
	root: {
		display: 'flex',
		marginBlockStart: token('space.1000'),
		marginBlockEnd: token('space.1000'),
		marginInlineStart: token('space.1000'),
		marginInlineEnd: token('space.1000'),
		gap: token('space.150'),
	},
});

interface NestedPopupProps {
	level: number;
}

const NestedPopup: FC<NestedPopupProps> = ({ level }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
			<Stack xcss={nestedPopupStyles.root}>
				<Section>
					<ButtonItem testId="create-project">Create project</ButtonItem>
					<ButtonItem testId="view-projects">View all projects</ButtonItem>
				</Section>
				<Section hasSeparator>
					<Popup
						isOpen={isOpen}
						shouldRenderToParent
						testId="nested-popup"
						placement="right-start"
						onClose={() => setIsOpen(false)}
						content={() => <NestedPopup level={level + 1} />}
						trigger={(triggerProps) => (
							<ButtonItem
								{...triggerProps}
								testId="nested-popup-trigger"
								isSelected={isOpen}
								onClick={() => setIsOpen(true)}
								iconAfter={<ArrowRight spacing="spacious" label="" />}
							>
								More actions (Level {level})
							</ButtonItem>
						)}
					/>
				</Section>
			</Stack>
		</Box>
	);
};

export default (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={spacerStyles.root}>
			<Button appearance="subtle" testId="button-0">
				Button 0
			</Button>
			<Popup
				isOpen={isOpen}
				shouldRenderToParent
				testId="popup"
				onClose={() => setIsOpen(false)}
				content={() => <NestedPopup level={1} />}
				placement="bottom-start"
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						testId="popup-trigger"
						iconBefore={MenuIcon}
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						Actions
					</Button>
				)}
			/>
			<Button appearance="subtle" testId="button-1">
				Button 1
			</Button>
		</Box>
	);
};
