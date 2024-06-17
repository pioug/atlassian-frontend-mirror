/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { Manager, Popper, Reference } from '../../src';

const popupStyles = css({
	maxWidth: '160px',
	padding: token('space.100', '8px'),
	background: token('elevation.surface.overlay'),
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.raised'),
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

const ScrollContainerExample = () => (
	<div
		style={{
			border: `1px solid ${token('color.border.bold')}`,
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				background: token('elevation.surface'),
			}}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<b style={{ display: 'block', marginBottom: token('space.400', '2rem') }}>
				Scroll to the middle of this container to see the popper <span>↘</span>
			</b>
			<Lorem count={10} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<BasicPopper />
			</div>
			<Lorem count={10} />
		</div>
	</div>
);

export default ScrollContainerExample;
