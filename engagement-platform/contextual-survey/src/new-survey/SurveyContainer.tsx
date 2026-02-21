/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { IconButton as Button } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import Image from '@atlaskit/image';
import { Stack } from '@atlaskit/primitives/compiled';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface Props {
	children: React.ReactNode;
	headerImage?: string;
	onDismiss: () => void;
}

const styles = cssMap({
	root: {
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('elevation.surface.overlay', N0),
		boxShadow: token('elevation.shadow.overlay', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
		// Hard-coded because there is no large enough space token and this component is not responsive.
		width: '384px',
	},
	container: {
		paddingTop: token('space.300', '24px'),
		paddingBottom: token('space.300', '24px'),
		paddingLeft: token('space.300', '24px'),
		paddingRight: token('space.300', '24px'),
	},
	buttonWrapperStyles: {
		position: 'absolute',
		top: token('space.100', '8px'),
		right: token('space.100', '8px'),
	},
});

export default ({ children, onDismiss, headerImage }: Props): JSX.Element => {
	return (
		<div css={styles.root} style={{}}>
			<div css={styles.buttonWrapperStyles}>
				<Button icon={CrossIcon} label="Dismiss" appearance="subtle" onClick={onDismiss} />
			</div>
			{headerImage && <Image width="384px" height="112px" src={headerImage} alt="Header" />}
			<Stack xcss={styles.container}>{children}</Stack>
		</div>
	);
};
