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
	headingLevel,
}: {
	/**
	 * The text of the heading.
	 */
	children: ReactNode;
	/**
	 * Renders the label as a semantic heading (`<h1>`–`<h6>`) at the given level.
	 * When omitted, the label renders as a non-heading paragraph (default).
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}): JSX.Element => {
	const id = useMenuSectionContext();
	const HeadingTag = headingLevel ? (`h${headingLevel}` as const) : 'p';

	return (
		// Not using Text primitive so we can add padding styles without adding an extra wrapper element.
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<HeadingTag css={styles.root} id={`${id}-heading`}>
			{children}
		</HeadingTag>
	);
};
