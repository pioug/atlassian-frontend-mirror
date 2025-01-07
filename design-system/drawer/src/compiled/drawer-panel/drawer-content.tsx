/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import ScrollLock from 'react-scrolllock';
import { mergeRefs } from 'use-callback-ref';

import { token } from '@atlaskit/tokens';

import { useEnsureIsInsideDrawer } from '../../context';
import usePreventProgrammaticScroll from '../../hooks/use-prevent-programmatic-scroll';
import { type DrawerContentProps } from '../types';

const styles = cssMap({
	default: {
		flex: 1,
		overflow: 'auto',
		marginTop: token('space.300', '24px'),
	},
});

const DrawerContentBase = forwardRef<HTMLDivElement, DrawerContentProps>(
	({ children, scrollContentLabel = 'Scrollable content', xcss }, scrollableRef) => {
		const [showContentFocus, setContentFocus] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const setLazyContentFocus = () => {
				const target = ref.current;
				target && setContentFocus(target.scrollHeight > target.clientHeight);
			};

			setLazyContentFocus();
		}, []);

		return (
			<div
				css={styles.default}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={xcss}
				ref={mergeRefs([ref, scrollableRef])}
				// tabindex is allowed here so that keyboard users can scroll content
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={showContentFocus ? 0 : undefined}
				role={showContentFocus ? 'region' : undefined}
				aria-label={showContentFocus ? scrollContentLabel : undefined}
				data-testid="drawer-contents"
			>
				{children}
			</div>
		);
	},
);

/**
 * __Drawer content__
 *
 * The main content section of the drawer panel.
 */
export const DrawerContent = ({ children, scrollContentLabel, xcss }: DrawerContentProps) => {
	useEnsureIsInsideDrawer();
	usePreventProgrammaticScroll();

	return (
		<ScrollLock>
			{/* An intermediate component is used to work around the behaviour of react-scrolllock
			overriding its child ref. Enabling us to merge the ref from react-scrolllock with our ref. */}
			<DrawerContentBase
				scrollContentLabel={scrollContentLabel}
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				xcss={xcss}
			>
				{children}
			</DrawerContentBase>
		</ScrollLock>
	);
};
