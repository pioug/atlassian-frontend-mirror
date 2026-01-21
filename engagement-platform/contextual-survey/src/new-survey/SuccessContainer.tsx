/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import doneSvg from './assets/checkIcon.svg';


const styles = cssMap({
	container: {
		gap: token('space.150', '12px'),
		alignContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
	},
});

interface Props {
	children: React.ReactNode;
}

export default ({ children }: Props) => (
	<Stack xcss={styles.container}>
		<Image width="88px" height="88px" src={doneSvg} alt="Success" />
		{children}
	</Stack>

);
