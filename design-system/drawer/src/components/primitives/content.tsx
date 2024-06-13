/** @jsx jsx */

import { useEffect, useRef, useState } from 'react';

import { css, type CSSObject, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type ContentProps } from '../types';

const defaultStyles: CSSObject = {
	flex: 1,
	overflow: 'auto',
	marginTop: token('space.300', '24px'),
};

const contentCSS = (): CSSObject => defaultStyles;

const Content = ({ cssFn, scrollContentLabel = 'Scrollable content', ...props }: ContentProps) => {
	const [showContentFocus, setContentFocus] = useState(false);
	const scrollableRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const setLazyContentFocus = () => {
			const target = scrollableRef.current;
			target && setContentFocus(target.scrollHeight > target.clientHeight);
		};

		setLazyContentFocus();
	}, []);

	/**
	 * I noticed the implementation at @atlaskit/checkbox would send the props to cssFn rather
	 * than the defaultStyles as the overrides guide suggests. I went with what the overrides
	 * guide suggested as it made more sense as a transformer of the current styles rather than
	 * a complete override with no chance of partially changing styles.
	 */
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			css={css(cssFn(defaultStyles))}
			ref={scrollableRef}
			// tabindex is allowed here so that keyboard users can scroll content
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={showContentFocus ? 0 : undefined}
			role={showContentFocus ? 'region' : undefined}
			aria-label={showContentFocus ? scrollContentLabel : undefined}
			data-testId="drawer-contents"
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

export default {
	component: Content,
	cssFn: contentCSS,
};
