/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, type ReactNode, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Target } from './styled';

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const color = {
	relative: 'green',
	absolute: 'yellow',
	fixed: 'red',
};

const boxShadow = token('elevation.shadow.overlay');

const positionStyles = css({
	width: '280px',
	height: '60px',
	backgroundColor: token('color.background.neutral'),
	borderRadius: '5px',
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
});

interface Pos {
	children?: ReactNode;
	pos: 'relative' | 'absolute' | 'fixed';
	pinned?: boolean;
	top?: number;
}

const Position = forwardRef<HTMLDivElement, Pos>(({ children, pos, pinned, top = 0 }, ref) => {
	const dynamicStyles: CSSProperties = {
		position: `${pos}`,
		top: `${top}px`,
		boxShadow: pinned || pos === 'fixed' ? boxShadow : 'none',
	} as CSSProperties;

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div css={positionStyles} ref={ref} style={dynamicStyles}>
			<Tooltip content={`Position "${pos}"`}>
				{(tooltipProps) => (
					<Target color={color[pos]} tabIndex={0} {...tooltipProps}>
						{capitalize(pos)}
					</Target>
				)}
			</Tooltip>
			<p>
				Tooltip container position is <code>{pos}</code>.
			</p>
			{children}
		</div>
	);
});

const positionExampleStyles = css({
	position: 'absolute',
	insetBlockStart: token('space.100', '8px'),
	insetInlineEnd: token('space.100', '8px'),
});

export default function CssPositionExample() {
	const panel = useRef<HTMLDivElement>(null);
	const [pinned, setPinned] = useState(false);
	const [top, setTop] = useState(0);

	const pin = () => {
		if (panel.current == null) {
			return;
		}
		const { top } = panel.current.getBoundingClientRect();
		setPinned(true);
		setTop(top);
	};

	const unpin = () => setPinned(false);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ height: 246, position: 'relative' }}>
			<Position pos="relative" top={0} />
			<Position pos="absolute" top={84} />
			<Position
				ref={panel}
				top={pinned ? top : 92}
				pinned={pinned}
				pos={pinned ? 'fixed' : 'relative'}
			>
				<button type="button" onClick={pinned ? unpin : pin} css={positionExampleStyles}>
					{pinned ? 'Unpin' : 'Pin'}
				</button>
			</Position>
		</div>
	);
}
