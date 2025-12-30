/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { IconButton as Button } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface Props {
	children: React.ReactNode;
	onDismiss: () => void;
}

const containerStyles = css({
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('radius.small', '3px'),
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.300', '24px'),
	paddingLeft: token('space.300', '24px'),
	boxShadow: token('elevation.shadow.overlay', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
	// Hard-coded because there is no large enough space token and this component is not responsive.
	width: '440px',
});

const buttonWrapperStyles = css({
	position: 'absolute',
	top: token('space.200', '16px'),
	right: token('space.200', '16px'),
});

export default ({ children, onDismiss }: Props) => {
	return (
		<div css={containerStyles} style={{}}>
			<div css={buttonWrapperStyles}>
				<Button icon={CrossIcon} label="Dismiss" appearance="subtle" onClick={onDismiss} />
			</div>
			{children}
		</div>
	);
};
