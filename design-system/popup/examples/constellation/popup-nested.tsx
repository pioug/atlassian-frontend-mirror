/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import ArrowRight from '@atlaskit/icon/core/migration/arrow-right';
import MenuIcon from '@atlaskit/icon/core/migration/menu';
import { ButtonItem, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const nestedPopupStyles = cssMap({
	root: {
		maxWidth: '800px',
		minWidth: '320px',
	},
});

const NestedPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
			<Stack xcss={nestedPopupStyles.root}>
				<Section title="Projects">
					<ButtonItem>Create project</ButtonItem>
					<ButtonItem>View all projects</ButtonItem>
				</Section>
				<Section hasSeparator>
					<Popup
						isOpen={isOpen}
						placement="right-start"
						shouldRenderToParent
						onClose={() => setIsOpen(false)}
						content={() => <NestedPopup />}
						trigger={(triggerProps) => (
							<ButtonItem
								{...triggerProps}
								isSelected={isOpen}
								onClick={() => setIsOpen(true)}
								iconAfter={<ArrowRight label="" />}
							>
								More actions
							</ButtonItem>
						)}
					/>
				</Section>
			</Stack>
		</Box>
	);
};

const PopupNestedExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <NestedPopup />}
			placement="bottom-start"
			shouldRenderToParent
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					isSelected={isOpen}
					iconBefore={MenuIcon}
					onClick={() => setIsOpen(!isOpen)}
				>
					Menu
				</Button>
			)}
		/>
	);
};

export default PopupNestedExample;
