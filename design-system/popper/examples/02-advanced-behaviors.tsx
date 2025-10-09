/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import { Fragment } from 'react';

import { css, jsx, styled } from '@compiled/react';

import { Manager, type Placement, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const POPPER_OFFSET = 8;
const POPPER_FLIP_PADDING = 5;

const REF_WIDTH = 80;
const REF_HEIGHT = 40;
const POPUP_HEIGHT = 40;
const SPACING = 35;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Popup = styled.div({
	background: 'white',
	borderColor: 'red',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	maxWidth: '110px',
	minHeight: `${POPUP_HEIGHT - 20}px`,
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	textOverflow: 'ellipsis',
	transition: 'opacity 200ms ease-in-out',
	boxShadow: token('elevation.shadow.overlay'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReferenceBox = styled.div({
	backgroundColor: token('color.background.brand.bold'),
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	color: 'white',
	textAlign: 'center',
	width: `${REF_WIDTH - 20}px`,
	height: `${REF_HEIGHT - 20}px`,
	textOverflow: 'ellipsis',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReferenceBoundaries = styled.div({
	background: 'lightblue',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: 'fit-content',
	height: 'fit-content',
});

const referenceShown = css({ opacity: 1 });
const referenceHidden = css({ opacity: 0 });

const BasicPopper = ({
	children,
	placement = 'bottom-start',
}: {
	children?: React.ReactNode;
	placement?: Placement;
}) => (
	<ReferenceBoundaries>
		<Manager>
			<Reference>{({ ref }) => <ReferenceBox ref={ref}>Reference</ReferenceBox>}</Reference>
			<Popper placement={placement}>
				{({ ref, style, placement, isReferenceHidden }) => (
					<Popup
						ref={ref}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={style}
						css={[referenceShown, isReferenceHidden && referenceHidden]}
						data-placement={placement}
					>
						{children || 'Popper'}
					</Popup>
				)}
			</Popper>
		</Manager>
	</ReferenceBoundaries>
);

const Test = () => (
	<>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ display: 'flex' }}>
			<BasicPopper>Popper</BasicPopper>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: -REF_HEIGHT, marginLeft: SPACING }}>
				<BasicPopper placement="right">Popper shifts along edge of window</BasicPopper>
			</div>
			<div
				style={{
					marginTop: -(REF_HEIGHT + POPPER_OFFSET),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginLeft: SPACING,
				}}
			>
				<BasicPopper>Not visible when reference is obscured</BasicPopper>
			</div>
			<div
				style={{
					marginTop: REF_HEIGHT + POPPER_OFFSET,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginLeft: SPACING,
				}}
			>
				<BasicPopper placement="top">Doesn't flip</BasicPopper>
			</div>
			<div
				style={{
					marginTop: REF_HEIGHT + POPPER_OFFSET - POPPER_FLIP_PADDING,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginLeft: SPACING,
				}}
			>
				<BasicPopper placement="top">Flips when within 5px of viewport boundary</BasicPopper>
			</div>
		</div>
		<div style={{ marginLeft: -REF_WIDTH }}>
			<BasicPopper>Popper shifts along edge of window</BasicPopper>
		</div>
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ marginTop: SPACING, marginLeft: -(REF_WIDTH + POPPER_OFFSET) }}
		>
			<BasicPopper>Not visible when reference is obscured</BasicPopper>
		</div>
	</>
);

const scrollContainerStyles = css({
	width: '1000px',
	margin: '0px',
	boxShadow: 'inset 0px 0px 0px 10px lightgrey',
});

const contentStyles = css({
	boxSizing: 'border-box',
	width: '200%',
	height: '200%',
});

const headingWrapperStyles = css({
	paddingBlockEnd: token('space.250', '20px'),
	paddingBlockStart: token('space.250', '20px'),
	paddingInlineEnd: token('space.250', '20px'),
	paddingInlineStart: token('space.250', '20px'),
});

const contentWrapperStyles = css({
	width: '90%',
	height: '400px',
	borderColor: 'black',
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	boxShadow: 'inset 0px 0px 0px 10px lightgrey',
	marginBlockStart: token('space.250', '20px'),
	overflow: 'auto',
});

export default () => (
	<div css={scrollContainerStyles}>
		<Test />
		{/* eslint-disable-next-line @atlaskit/design-system/use-primitives */}
		<div css={headingWrapperStyles}>
			<h3>Scroll Container</h3>
		</div>
		<div
			css={contentWrapperStyles}
			// Tab index required here to support keyboard users scrolling the container
			// eslint-disable-next-line @atlassian/a11y/no-noninteractive-tabindex
			tabIndex={0}
			role="region"
			aria-label="Scrollable content"
		>
			<div css={contentStyles}>
				<Test />
			</div>
		</div>
	</div>
);
