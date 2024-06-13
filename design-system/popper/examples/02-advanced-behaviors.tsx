/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import styled from '@emotion/styled';

import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Manager, type Placement, Popper, Reference } from '../src';

interface PopupProps {
	isReferenceHidden: boolean | undefined;
}

const POPPER_OFFSET = 8;
const POPPER_FLIP_PADDING = 5;

const REF_WIDTH = 80;
const REF_HEIGHT = 40;
const POPUP_HEIGHT = 40;
const SPACING = 35;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Popup = styled.div`
	background: white;
	border: 2px solid red;
	border-radius: ${borderRadius()}px;
	max-width: 110px;
	min-height: ${POPUP_HEIGHT - 20}px;
	padding: ${token('space.100', '8px')};
	text-overflow: 'ellipsis';
	transition: opacity 200ms ease-in-out;
	opacity: ${(p: PopupProps) => (p.isReferenceHidden ? 0 : 1)};
	box-shadow: ${token('elevation.shadow.overlay')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReferenceBox = styled.div({
	background: token('color.background.brand.bold'),
	padding: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	color: 'white',
	textAlign: 'center',
	width: `${REF_WIDTH - 20}px`,
	height: `${REF_HEIGHT - 20}px`,
	textOverflow: "'ellipsis'",
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ReferenceBoundaries = styled.div({
	background: 'lightblue',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	padding: token('space.100', '8px'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: 'fit-content',
	height: 'fit-content',
});

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
						isReferenceHidden={isReferenceHidden}
						ref={ref}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={style}
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

export default () => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			margin: '0px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			width: '1000px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			boxShadow: 'inset 0px 0px 0px 10px lightgrey',
		}}
	>
		<Test />
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ padding: token('space.250', '20px') }}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<h3 style={{ marginTop: SPACING }}> Scroll Container</h3>
		</div>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				border: '1px solid black',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxShadow: 'inset 0px 0px 0px 10px lightgrey',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '400px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '90%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.250', '20px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				overflow: 'auto',
			}}
		>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '200%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: '200%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					boxSizing: 'border-box',
				}}
			>
				<Test />
			</div>
		</div>
	</div>
);
