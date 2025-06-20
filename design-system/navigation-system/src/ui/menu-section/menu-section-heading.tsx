/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useMenuSectionContext } from './menu-section-context';

const styles = cssMap({
	root: {
		color: token('color.text.subtlest'),
		font: token('font.heading.xxsmall'),
		paddingBlock: token('space.100'),
		paddingInlineStart: token('space.075'),
	},
});

/**
 * __MenuSectionHeading__
 *
 * The label for the menu section group.
 */
export const MenuSectionHeading = ({
	children,
}: {
	/**
	 * The text of the heading.
	 */
	children: ReactNode;
}): JSX.Element => {
	const id = useMenuSectionContext();

	return (
		// eslint-disable-next-line @atlaskit/design-system/use-heading
		<h2 css={styles.root} id={`${id}-heading`}>
			{children}
		</h2>
	);
};
