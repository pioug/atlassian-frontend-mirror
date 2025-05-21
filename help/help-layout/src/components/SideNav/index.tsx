/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';
import { cssMap, cx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Box, Flex, Pressable, Stack, Text } from '@atlaskit/primitives/compiled';
import { type SideNavTab } from '../../model/HelpLayout';
import Tooltip from '@atlaskit/tooltip';
import { jsx } from '@compiled/react';
import { DynamicHeader } from '../DynamicHeader';

interface SideNavProps {
	sideNavTabs: SideNavTab[];
}

const styles = cssMap({
	mainContent: {
		height: '100%',
		width: '100%',
		overflow: 'hidden',
	},
	navBarWrapper: {
		height: '100%',
		width: '100%',
		overflow: 'auto',
	},
	navButton: {
		display: 'flex',
		borderRadius: token('border.radius.100'),
		backgroundColor: 'transparent',
		flexDirection: 'column',
		alignItems: 'center',
		cursor: 'pointer',
		gap: token('space.100'),
		boxSizing: 'border-box',
		whiteSpace: 'nowrap',
		border: `${token('border.width')} solid transparent`,
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			color: token('color.text'),
		},
		width: '100%',
		paddingBlock: token('space.100'),
	},
	navButtonSelected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.link'),
		borderColor: token('color.border.accent.blue'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
			color: token('color.link'),
		},
	},
	wrapper: {
		height: '100%',
		minWidth: '60px',
		overflow: 'auto',
		backgroundColor: token('color.background.input.hovered'),
	},
	navItemWrapper: {
		marginTop: token('space.050'),
		marginRight: token('space.050'),
		marginBottom: token('space.050'),
		marginLeft: token('space.050'),
	},
});

export const SideNav = ({ sideNavTabs }: SideNavProps) => {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<Flex xcss={styles.navBarWrapper}>
			<Flex justifyContent="space-between" xcss={styles.wrapper} direction="column">
				<Stack testId="side-nav-tabs">
					{sideNavTabs.map((tab, index) => (
						<Box xcss={styles.navItemWrapper} key={tab.label} testId={`side-nav-${tab.label}`}>
							<Tooltip ignoreTooltipPointerEvents position="left" content={tab.label}>
								<Pressable
									xcss={cx(styles.navButton, index === activeIndex && styles.navButtonSelected)}
									onClick={(event) => {
										setActiveIndex(index);
										tab.onClick && tab?.onClick(event);
									}}
									testId={`side-nav-button-${tab.label}`}
								>
									{tab.icon}
									<Text
										size="small"
										color={index === activeIndex ? 'color.link' : 'color.text.subtle'}
									>
										{tab.label}
									</Text>
								</Pressable>
							</Tooltip>
						</Box>
					))}
				</Stack>
			</Flex>
			<Flex direction="column" xcss={styles.mainContent}>
				<DynamicHeader
					title={sideNavTabs[activeIndex].header.title}
					onCloseButtonClick={sideNavTabs[activeIndex].header.onCloseButtonClick}
					onNewChatButtonClick={sideNavTabs[activeIndex].header.onNewChatButtonClick}
					newChatButtonDisabled={sideNavTabs[activeIndex].header.newChatButtonDisabled}
					onGoBackToHistoryList={sideNavTabs[activeIndex].header.onGoBackToHistoryList}
					isBackButtonVisible={sideNavTabs[activeIndex].header.isBackButtonVisible}
				/>
				{sideNavTabs[activeIndex].contentRender()}
			</Flex>
		</Flex>
	);
};
