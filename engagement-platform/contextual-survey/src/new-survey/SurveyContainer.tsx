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
import { token } from '@atlaskit/tokens';

interface Props {
	children: React.ReactNode;
	headerImage?: string;
	onDismiss: () => void;
}

const styles = cssMap({
	root: {
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		// Hard-coded because there is no large enough space token and this component is not responsive.
		width: '384px',
	},
	container: {
		paddingTop: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
	},
	buttonWrapperStyles: {
		position: 'absolute',
		top: token('space.100'),
		right: token('space.100'),
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
