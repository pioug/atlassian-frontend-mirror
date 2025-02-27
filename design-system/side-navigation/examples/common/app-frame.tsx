/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import GlobalNav from './global-nav';

const styles = cssMap({
	container: {
		height: '100%',
		minHeight: 600,
	},
	positionRelative: { zIndex: 10, position: 'relative' },
	boxHeight: { height: 'calc(100% - 56px)', minHeight: 600, display: 'flex' },
	minHeight: { minHeight: 600 },
});

const baseHeight = css({
	height: '100%',
});

const baseBorder = css({
	borderInlineEnd: `1px solid ${token('color.border')}`,
});

interface AppFrameProps {
	children: React.ReactNode;
	content?: React.ReactNode;
	shouldHideAppBar?: boolean;
	shouldHideBorder?: boolean;
}

const AppFrame = ({ children, shouldHideAppBar, shouldHideBorder, content }: AppFrameProps) => {
	return (
		// eslint-disable-next-line
		<div onClick={(e) => e.preventDefault()} css={styles.container}>
			{shouldHideAppBar || (
				<div css={styles.positionRelative}>
					<GlobalNav />
				</div>
			)}
			<div css={[styles.boxHeight, shouldHideAppBar && baseHeight]}>
				<div css={[styles.minHeight, !shouldHideBorder && baseBorder]}>{children}</div>
				{content}
			</div>
		</div>
	);
};

export default AppFrame;
