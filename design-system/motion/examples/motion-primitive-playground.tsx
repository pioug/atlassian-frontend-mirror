/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Heading from '@atlaskit/heading/heading';
import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import type { Motion as MotionToken } from '@atlaskit/tokens/css-type-schema';

import { Block } from './utils/blocks';
import { RetryContainer } from './utils/containers';

const motionEntryTokens: Record<string, MotionToken> = {
	'motion.avatar.enter': token('motion.avatar.enter'),
	'motion.blanket.enter': token('motion.blanket.enter'),
	'motion.flag.enter': token('motion.flag.enter'),
	'motion.modal.enter': token('motion.modal.enter'),
	'motion.popup.enter.top': token('motion.popup.enter.top'),
	'motion.popup.enter.bottom': token('motion.popup.enter.bottom'),
	'motion.popup.enter.left': token('motion.popup.enter.left'),
	'motion.popup.enter.right': token('motion.popup.enter.right'),
	'motion.spotlight.enter': token('motion.spotlight.enter'),
};

const motionExitTokens: Record<string, MotionToken> = {
	'motion.avatar.exit': token('motion.avatar.exit'),
	'motion.blanket.exit': token('motion.blanket.exit'),
	'motion.flag.exit': token('motion.flag.exit'),
	'motion.modal.exit': token('motion.modal.exit'),
	'motion.popup.exit.top': token('motion.popup.exit.top'),
	'motion.popup.exit.bottom': token('motion.popup.exit.bottom'),
	'motion.popup.exit.left': token('motion.popup.exit.left'),
	'motion.popup.exit.right': token('motion.popup.exit.right'),
	'motion.spotlight.exit': token('motion.spotlight.exit'),
};

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.150'),
		paddingInlineStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
	box: {
		height: '118px',
		width: '98px',
	},
	controls: {
		marginBlockEnd: token('space.150'),
		marginBlockStart: token('space.150'),
	},
});

export default (): React.JSX.Element => {
	const [isIn, setIsIn] = useState(true);
	const [enterPath, setEnterPath] = useState<string>('motion.blanket.enter');
	const [exitPath, setExitPath] = useState<string>('motion.blanket.exit');
	return (
		<RetryContainer>
			<Box xcss={styles.root}>
				<Heading size="medium">Pre-defined animations</Heading>
				<Box xcss={styles.controls}>
					<Inline space="space.150" alignBlock="center">
						<Stack space="space.100">
							<Text weight="medium">Entry animation</Text>
							<DropdownMenu shouldRenderToParent trigger={enterPath}>
								<DropdownItemGroup>
									{Object.keys(motionEntryTokens).map((name) => (
										<DropdownItem
											key={name}
											isSelected={name === enterPath}
											onClick={() => setEnterPath(name)}
										>
											{name}
										</DropdownItem>
									))}
								</DropdownItemGroup>
							</DropdownMenu>
						</Stack>
						<Stack space="space.100">
							<Text weight="medium">Exit animation</Text>
							<DropdownMenu shouldRenderToParent trigger={exitPath}>
								<DropdownItemGroup>
									{Object.keys(motionExitTokens).map((name) => (
										<DropdownItem
											key={name}
											isSelected={name === exitPath}
											onClick={() => setExitPath(name)}
										>
											{name}
										</DropdownItem>
									))}
								</DropdownItemGroup>
							</DropdownMenu>
						</Stack>
						<Stack space="space.100">
							<Text weight="medium">Control</Text>
							<Button appearance="primary" onClick={() => setIsIn((prev) => !prev)}>
								{isIn ? 'Exit' : 'Enter'}
							</Button>
						</Stack>
					</Inline>
				</Box>
				<Box xcss={styles.box}>
					<ExitingPersistence appear>
						{isIn && (
							<Motion
								enteringAnimation={motionEntryTokens[enterPath]}
								exitingAnimation={motionExitTokens[exitPath]}
							>
								<Block appearance="small" />
							</Motion>
						)}
					</ExitingPersistence>
				</Box>
			</Box>
		</RetryContainer>
	);
};
