/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef, useState } from 'react';

import { cssMap } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import SignatureIcon from '@atlaskit/icon-lab/core/signature';
import AppsIcon from '@atlaskit/icon/core/apps';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import HeartIcon from '@atlaskit/icon/core/heart';
import PagesIcon from '@atlaskit/icon/core/pages';
import SidebarCollapseIcon from '@atlaskit/icon/core/sidebar-collapse';
import SidebarExpandIcon from '@atlaskit/icon/core/sidebar-expand';
import type { IconProps } from '@atlaskit/icon/types';
import IconMotion, { type IconMotionHandle } from '@atlaskit/motion/entering/icon-motion';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	row: {
		minHeight: '32px',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
	container: {
		height: '16px',
	},
});

/**
 * Swapping the icon inside `IconMotion` plays `exitingAnimation` on the icon being replaced and
 * `enteringAnimation` on the new icon. Use the button repeatedly, including quickly, to see
 * interrupted swaps.
 */
export default function IconMotionExample(): React.JSX.Element {
	const [animate, setAnimate] = useState(false);

	return (
		<Stack space="space.200">
			<Inline space="space.050">
				<Button onClick={() => setAnimate((previous) => !previous)}>Animate</Button>
			</Inline>

			<Heading size="medium">Enter/Exit</Heading>
			<Inline space="space.050" xcss={styles.container}>
				<IconMotion
					enteringAnimation={token('motion.iconography.enter.fade')}
					exitingAnimation={token('motion.iconography.exit.fade')}
				>
					{animate && <SignatureIcon label="Signature" />}
				</IconMotion>
				<IconMotion
					enteringAnimation={token('motion.iconography.enter.fade')}
					exitingAnimation={token('motion.iconography.exit.fade')}
				>
					{animate && <HeartIcon label="Signature" />}
				</IconMotion>
			</Inline>

			<Heading size="medium">Swap Icons</Heading>
			<Inline space="space.050" xcss={styles.container}>
				<IconMotion
					enteringAnimation={token('motion.iconography.enter.fade')}
					exitingAnimation={token('motion.iconography.exit.fade')}
				>
					{animate ? <SidebarExpandIcon label="" /> : <SidebarCollapseIcon label="" />}
				</IconMotion>
				<IconMotion
					enteringAnimation={token('motion.iconography.enter.fade')}
					exitingAnimation={token('motion.iconography.exit.fade')}
				>
					{animate ? <ChevronDownIcon label="" /> : <PagesIcon label="" />}
				</IconMotion>
			</Inline>
			<Heading size="small">Swap Icons on hover</Heading>
			<SwapIconsOnHover />

			<Heading size="small">Swap Icons on click</Heading>
			<SwapIconsOnClick />

			<Heading size="small">Swap Icons on hover and rotate on click</Heading>
			<SwapIconsOnHoverAndRotateOnClick />

			<Heading size="medium">Button with cycle up</Heading>
			<Heading size="small">Exit and enter simultaneously</Heading>
			<ButtonWithCycleUp />
			<IconButtonWithCycleUp />
			<IconButtonWithCycleUp isCompact />
			<Heading size="small">Exit then enter</Heading>
			<ButtonWithCycleUpExitThenEnter />

			<Heading size="medium">Button to expand and collapse</Heading>
			<ButtonWithRotate />
			<Heading size="small">Click</Heading>
			<IconButtonRotateOnClick />
			<Heading size="small">Hover</Heading>
			<IconButtonRotateOnHover />
		</Stack>
	);
}

const iconMotionStyles = cssMap({
	motionBase: {
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
});

const SwapIconsOnHover = () => {
	const [switchIcon, setSwitchIcon] = useState(false);

	return (
		<Flex>
			<Button
				onMouseEnter={() => setSwitchIcon(true)}
				onMouseLeave={() => setSwitchIcon(false)}
				iconBefore={(iconProps) => (
					<IconMotion
						enteringAnimation={token('motion.iconography.enter.fade')}
						exitingAnimation={token('motion.iconography.exit.fade')}
					>
						{switchIcon ? (
							<ChevronRightIcon label={iconProps.label} />
						) : (
							<AppsIcon label={iconProps.label} />
						)}
					</IconMotion>
				)}
			>
				Apps
			</Button>
		</Flex>
	);
};

const SwapIconsOnClick = () => {
	const [switchIcon, setSwitchIcon] = useState(false);

	return (
		<Flex>
			<Button
				onClick={() => setSwitchIcon((previous) => !previous)}
				iconBefore={(iconProps) => (
					<IconMotion
						enteringAnimation={token('motion.iconography.enter.fade')}
						exitingAnimation={token('motion.iconography.exit.fade')}
					>
						{switchIcon ? (
							<ChevronRightIcon label={iconProps.label} />
						) : (
							<AppsIcon label={iconProps.label} />
						)}
					</IconMotion>
				)}
			>
				Apps
			</Button>
		</Flex>
	);
};

const SwapIconsOnHoverAndRotateOnClick = () => {
	const [rotateIcon, setRotateIcon] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Flex>
			<Button
				onClick={() => setRotateIcon((previous) => !previous)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				iconBefore={(iconProps) => (
					<IconMotion.Rotate
						enteringAnimation={token('motion.iconography.enter.fade')}
						exitingAnimation={token('motion.iconography.exit.fade')}
						isActive={rotateIcon}
					>
						{isHovered || rotateIcon ? (
							<ChevronRightIcon label={iconProps.label} />
						) : (
							<AppsIcon label={iconProps.label} />
						)}
					</IconMotion.Rotate>
				)}
			>
				Apps
			</Button>
		</Flex>
	);
};

const ButtonWithCycleUp = () => {
	const [key, setKey] = useState(0);

	return (
		<Inline space="space.050">
			<Button onClick={() => setKey((previous) => previous + 1)}>Cycle</Button>
			<Flex xcss={iconMotionStyles.motionBase}>
				<IconMotion
					overshoot={token('space.150')}
					enteringAnimation={token('motion.iconography.enter.cycle.up')}
					exitingAnimation={token('motion.iconography.exit.cycle.up')}
					shouldExitThenEnter={false}
				>
					<ArrowUpIcon key={key} label="" />
				</IconMotion>
			</Flex>
		</Inline>
	);
};

const IconButtonWithCycleUp = ({ isCompact }: { isCompact?: boolean }) => {
	const iconMotionRef = useRef<IconMotionHandle>(null);

	return (
		<Inline space="space.050">
			<IconButton
				label="Send"
				spacing={isCompact ? 'compact' : 'default'}
				icon={(iconProps) => (
					<IconMotion
						ref={iconMotionRef}
						overshoot={iconProps.motionOvershoot}
						enteringAnimation={token('motion.iconography.enter.cycle.up')}
						exitingAnimation={token('motion.iconography.exit.cycle.up')}
						shouldExitThenEnter={false}
					>
						<ArrowUpIcon label={iconProps.label} />
					</IconMotion>
				)}
				onClick={() => iconMotionRef.current?.reanimate()}
			/>
		</Inline>
	);
};

const ButtonWithCycleUpExitThenEnter = () => {
	const iconMotionRef = useRef<IconMotionHandle>(null);

	return (
		<Inline space="space.050">
			<Button onClick={() => iconMotionRef.current?.reanimate()}>Cycle</Button>
			<Flex xcss={iconMotionStyles.motionBase}>
				<IconMotion
					ref={iconMotionRef}
					overshoot={token('space.100')}
					enteringAnimation={token('motion.iconography.enter.cycle.up')}
					exitingAnimation={token('motion.iconography.exit.cycle.up')}
				>
					<ArrowUpIcon label="" />
				</IconMotion>
			</Flex>
		</Inline>
	);
};

const ButtonWithRotate = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Inline space="space.050">
			<Button onClick={() => setIsExpanded((previous) => !previous)}>Rotate</Button>
			<Flex xcss={iconMotionStyles.motionBase}>
				<IconMotion.Rotate isActive={isExpanded}>
					<ChevronRightIcon label="" />
				</IconMotion.Rotate>
			</Flex>
		</Inline>
	);
};

const IconButtonRotateOnClick = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	const renderIcon = (iconProps: IconProps) => (
		<IconMotion.Rotate isActive={isExpanded}>
			<ChevronRightIcon label={iconProps.label} />
		</IconMotion.Rotate>
	);

	return (
		<Inline space="space.050">
			<IconButton
				label="Send"
				icon={renderIcon}
				onClick={() => setIsExpanded((previous) => !previous)}
			/>
			<Button iconAfter={renderIcon} onClick={() => setIsExpanded((previous) => !previous)}>
				Rotate
			</Button>
			<Button iconBefore={renderIcon} onClick={() => setIsExpanded((previous) => !previous)}>
				Rotate
			</Button>
		</Inline>
	);
};

const IconButtonRotateOnHover = () => {
	const [isHovered, setIsHovered] = useState(false);

	const renderIcon = (iconProps: IconProps) => (
		<IconMotion.Rotate isActive={isHovered}>
			<ChevronRightIcon label={iconProps.label} />
		</IconMotion.Rotate>
	);

	return (
		<Inline space="space.050">
			<IconButton
				label="Send"
				icon={renderIcon}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			/>
			<Button
				iconAfter={renderIcon}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				Rotate
			</Button>
			<Button
				iconBefore={renderIcon}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				Rotate
			</Button>
		</Inline>
	);
};
