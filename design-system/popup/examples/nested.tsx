/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import { ButtonItem, Section } from '@atlaskit/menu';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import Popup from '../src';

const nestedPopupStyles = xcss({
	maxWidth: '800px',
	minWidth: '320px',
});

const spacerStyles = xcss({
	display: 'flex',
	margin: 'space.1000',
	gap: 'space.150',
});

interface NestedPopupProps {
	level: number;
}

const NestedPopup: FC<NestedPopupProps> = ({ level }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
			<Stack xcss={nestedPopupStyles}>
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
								iconAfter={<ArrowRight label="" />}
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

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={spacerStyles}>
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
