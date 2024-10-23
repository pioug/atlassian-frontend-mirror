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
import { ButtonItem, Section } from '@atlaskit/menu';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import Popup from '../../src';

const nestedPopupStyles = xcss({
	maxWidth: '800px',
	minWidth: '320px',
});

const NestedPopup = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
			<Stack xcss={nestedPopupStyles}>
				<Section>
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
