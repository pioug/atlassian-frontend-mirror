/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		boxSizing: 'border-box',
		height: '20px',
		width: '20px',
		borderRadius: token('border.radius.100'),
	},
});

export type ContainerAvatarProps = {
	/**
	 * The source of the avatar image.
	 */
	src: string;
};

/**
 * __Container avatar__
 *
 * This component has been introduced specifically for the Nav4 sidebar because the existing Avatar component
 * did not offer the correct sizes to align with the designs. It was necessary to create a new component rather than
 * using the ADS image component because that did not allow the ability to set the border and radius and the desired
 * presentation was not achievable through nesting within another styled component. At some point this component maybe
 * removed if the Avatar component is updated to allow for the desired presentation.
 *
 * A container avatar to be used in sidebar navigation items.
 */
export const ContainerAvatar = ({ src }: ContainerAvatarProps) => (
	<img src={src} css={styles.root} alt="" />
);
