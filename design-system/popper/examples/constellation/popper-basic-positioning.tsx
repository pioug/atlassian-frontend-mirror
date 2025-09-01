/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const popupStyles = css({
	maxWidth: '160px',
	backgroundColor: token('elevation.surface.overlay'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.raised'),
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
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
