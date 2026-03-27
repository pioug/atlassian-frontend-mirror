/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { IconButton as Button } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';
import { token } from '@atlaskit/tokens';

interface Props {
	children: React.ReactNode;
	onDismiss: () => void;
}

const containerStyles = css({
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.small', '3px'),
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
	boxShadow: token('elevation.shadow.overlay'),
	// Hard-coded because there is no large enough space token and this component is not responsive.
	width: '440px',
});

const buttonWrapperStyles = css({
	position: 'absolute',
	top: token('space.200'),
	right: token('space.200'),
});

export default ({ children, onDismiss }: Props): JSX.Element => {
	return (
		<div css={containerStyles} style={{}}>
			<div css={buttonWrapperStyles}>
				<Button icon={CrossIcon} label="Dismiss" appearance="subtle" onClick={onDismiss} />
			</div>
			{children}
		</div>
	);
};
