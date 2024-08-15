/**
 * @jsxRuntime classic
 */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import { ButtonItem, MenuGroup } from '@atlaskit/menu';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const buttonWrapperStyles = xcss({
	paddingBlockStart: 'space.075',
	paddingBlockEnd: 'space.075',
});

const lastButtonWrapperStyles = xcss({
	paddingBlockStart: 'space.075',
	paddingBlockEnd: 'space.075',
	borderBlockStart: `2px solid ${token('color.border')}`,
});
const spacerStyles = xcss({
	display: 'flex',
	margin: 'space.1000',
	gap: 'space.150',
});

const NestedPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<MenuGroup maxWidth={800} minWidth={320} onClick={(e) => e.stopPropagation()}>
			<Box xcss={buttonWrapperStyles}>
				<ButtonItem testId="create-project">Create project</ButtonItem>
				<ButtonItem testId="view-projects">View all projects</ButtonItem>
			</Box>
			<Popup
				isOpen={isOpen}
				shouldRenderToParent
				testId="nested-popup"
				placement="right-start"
				onClose={() => setIsOpen(false)}
				content={() => <NestedPopup />}
				trigger={(triggerProps) => (
					<Box xcss={lastButtonWrapperStyles}>
						<ButtonItem
							{...triggerProps}
							testId="nested-popup-trigger"
							isSelected={isOpen}
							onClick={() => setIsOpen(true)}
							iconAfter={<ArrowRight label="" />}
						>
							More actions
						</ButtonItem>
					</Box>
				)}
			/>
		</MenuGroup>
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
				content={() => <NestedPopup />}
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
