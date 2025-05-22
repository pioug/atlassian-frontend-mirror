/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { type HeadingItemProps, HeadingItem as MenuHeadingItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { HeadingItemProps } from '@atlaskit/menu';

const styles = cssMap({
	headingItem: {
		paddingInline: token('space.100', '8px'),
	},
});

/**
 * __Heading item__
 *
 * Available for advanced use cases, for most situations providing a `title` to `section` should be enough.
 *
 */
const HeadingItem = (props: HeadingItemProps) => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	// @ts-expect-error - Although this isn't defined on props it is available because we've used
	// spread props below and on the jsx element in MenuHeadingItem.
	const UNSAFE_className = props.className;

	return (
		<MenuHeadingItem
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @repo/internal/react/no-unsafe-overrides
			{...props}
			// @ts-expect-error
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides
			className={UNSAFE_className}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides
			css={styles.headingItem}
		/>
	);
};

export default HeadingItem;
