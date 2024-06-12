/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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

const BasicPositioningExample = () => (
	<Manager>
		<Reference>
			{({ ref }) => (
				<Button appearance="primary" ref={ref}>
					Reference element
				</Button>
			)}
		</Reference>
		<Popper placement="right">
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div ref={ref} style={style} css={popupStyles}>
					This text is a popper placed to the right
				</div>
			)}
		</Popper>
	</Manager>
);

export default BasicPositioningExample;
