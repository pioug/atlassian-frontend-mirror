/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import {
	SELECTION_STYLE_CONTEXT_DO_NOT_USE,
	SpacingContext,
} from '../internal/components/menu-context';
import type { MenuGroupProps } from '../types';

const baseStyles = css({
	display: 'flex',
	position: 'static',
	flexDirection: 'column',
	overflow: 'auto',
});

/**
 * __Menu group__
 *
 * A menu group includes all the actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/menu-group)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const MenuGroup: (props: MenuGroupProps) => JSX.Element = ({
	isLoading,
	maxWidth,
	minWidth,
	minHeight,
	maxHeight,
	testId,
	role,
	spacing = 'cozy',
	menuLabel,
	// Although this isn't defined on props it is available because we've used
	// Spread props below and on the jsx element. To forcibly block usage I've
	// picked it out and supressed the expected type error.
	// @ts-expect-error
	className: UNSAFE_className,
	...rest
}: MenuGroupProps) => (
	<SpacingContext.Provider value={spacing}>
		<SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="border">
			<div
				aria-busy={isLoading}
				style={{
					minWidth,
					maxWidth,
					minHeight,
					maxHeight,
				}}
				css={baseStyles}
				data-testid={testId}
				role={role}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={UNSAFE_className}
				aria-label={menuLabel}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			/>
		</SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
	</SpacingContext.Provider>
);

export default MenuGroup;
