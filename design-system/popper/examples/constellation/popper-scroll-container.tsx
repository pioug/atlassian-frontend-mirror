/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const popupStyles = css({
	maxWidth: '160px',
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: '3px',
	boxShadow: token('elevation.shadow.raised'),
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
});

const popupHiddenStyles = css({
	pointerEvents: 'none',
	visibility: 'hidden',
});

const BasicPopper = () => (
	<Manager>
		<Reference>
			{({ ref }) => (
				<Button appearance="primary" ref={ref}>
					Reference element
				</Button>
			)}
		</Reference>
		<Popper>
			{({ ref, placement, isReferenceHidden, style }) => (
				<div
					ref={ref}
					data-placement={placement}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
					css={[popupStyles, isReferenceHidden && popupHiddenStyles]}
				>
					<h3>New Popper</h3>
					<Lorem count={1} />
				</div>
			)}
		</Popper>
	</Manager>
);

const containerStyles = css({
	maxWidth: '800px',
	maxHeight: '400px',
	borderColor: 'black',
	borderStyle: 'solid',
	borderWidth: '1px',
	marginBlockStart: token('space.250', '20px'),
	overflow: 'auto',
});

const innerStyles = css({
	boxSizing: 'border-box',
	width: '300%',
	height: '250%',
	backgroundColor: token('elevation.surface'),
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.200', '16px'),
	paddingInlineStart: token('space.200', '16px'),
});

const popperWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
});

const instructionStyles = css({
	display: 'block',
	marginBlockEnd: token('space.400', '2rem'),
});

const ScrollContainerExample = () => (
	<div css={containerStyles}>
		<div css={innerStyles}>
			<b css={instructionStyles}>
				Scroll to the middle of this container to see the popper <span>↘</span>
			</b>
			<Lorem count={10} />
			<div css={popperWrapperStyles}>
				<BasicPopper />
			</div>
			<Lorem count={10} />
		</div>
	</div>
);

export default ScrollContainerExample;
