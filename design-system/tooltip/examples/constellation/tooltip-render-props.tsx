/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, Fragment, useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import { token } from '@atlaskit/tokens';
import Tooltip, {
	type PositionType,
	TooltipPrimitive,
	type TooltipPrimitiveProps,
} from '@atlaskit/tooltip';

const VALID_POSITIONS: PositionType[] = ['mouse', 'top', 'right', 'bottom', 'left'];

const shortMessage = "I'm a short tooltip";
const longMessage = 'I am a longer tooltip with a decent amount of content inside';

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		color: token('color.text'),
		maxHeight: '300px',
		maxWidth: '300px',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
});

const CustomTooltip: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TooltipPrimitiveProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(function CustomTooltip(
	{ children, className, ...rest },
	ref,
) {
	return (
		<TooltipPrimitive
			{...rest}
			// Manually passing on `className` so it gets merged correctly in the build output.
			// The passed classname is mostly used for integration testing (`.Tooltip`)
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			// "css" does not "exist" - it gets transformed into "className" by compiled
			css={styles.root}
			ref={ref}
		>
			{children}
		</TooltipPrimitive>
	);
});

export default function TooltipRenderPropsExample() {
	const [message, setMessage] = React.useState(shortMessage);
	const [position, setPosition] = useState(0);

	const updateTooltip = React.useRef<() => void>();

	const changeDirection = () => {
		setPosition((position + 1) % VALID_POSITIONS.length);
	};

	const handleOnMouseDown = (event: React.MouseEvent<HTMLElement>) => console.log(event);

	const positionText = VALID_POSITIONS[position];

	React.useLayoutEffect(() => {
		updateTooltip.current?.();
	}, [message]);

	return (
		<Fragment>
			<p>Icon</p>
			<Tooltip content="Add content">
				{(tooltipProps) => <IconButton icon={AddIcon} label="Add" testId="add" {...tooltipProps} />}
			</Tooltip>
			<p>Click to update</p>
			<Tooltip
				content={({ update }) => {
					updateTooltip.current = update;
					return message;
				}}
			>
				{(tooltipProps) => (
					<Button
						{...tooltipProps}
						onClick={() => setMessage(message === shortMessage ? longMessage : shortMessage)}
						onMouseDown={(e) => {
							tooltipProps.onMouseDown(e);
							handleOnMouseDown(e);
						}}
					>
						Click to toggle tooltip
					</Button>
				)}
			</Tooltip>
			<p>Component in content</p>
			<Tooltip component={CustomTooltip} content="Hello World">
				{(tooltipProps) => (
					<Button appearance="primary" {...tooltipProps}>
						Hover or keyboard focus on me
					</Button>
				)}
			</Tooltip>
			<p>Position</p>
			<div style={{ padding: `${token('space.500')} ${token('space.500')}` }}>
				<Tooltip content={positionText} position={positionText}>
					{(tooltipProps) => (
						<Button {...tooltipProps} onClick={changeDirection}>
							Target
						</Button>
					)}
				</Tooltip>
			</div>
		</Fragment>
	);
}
