import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

interface PopupProps {
	isReferenceHidden: boolean | undefined;
}
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Popup = styled.div`
	background: white;
	border: 2px solid red;
	border-radius: ${borderRadius()}px;
	max-width: 160px;
	padding: ${token('space.100', '8px')};
	transition: opacity 200ms ease-in-out;
	opacity: ${(p: PopupProps) => (p.isReferenceHidden === false ? 1 : 0)};
	box-shadow: ${token('elevation.shadow.overlay')};
`;

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
			{({ ref, style, placement, isReferenceHidden }) => (
				<Popup
					isReferenceHidden={isReferenceHidden}
					ref={ref}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
					data-placement={placement}
				>
					<h3>New Popper</h3>
					<Lorem count={1} />
				</Popup>
			)}
		</Popper>
	</Manager>
);

export default () => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			border: '1px solid black',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			maxHeight: '400px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			maxWidth: '800px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			marginTop: token('space.250', '20px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			overflow: 'auto',
		}}
	>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '300%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '250%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				boxSizing: 'border-box',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				padding: token('space.200', '16px'),
			}}
		>
			<h2>Scroll down halfway, then across to see the popper</h2>
			<Lorem count={10} />
			<h2>Halfway, now scroll right</h2>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<BasicPopper />
			</div>
			<Lorem count={10} />
		</div>
	</div>
);
