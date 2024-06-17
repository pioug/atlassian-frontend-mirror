/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { md } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';
import { toAbsolutePath } from './index';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'code:not([class])': {
		borderRadius: '3px',
		display: 'inline-block',
		fontSize: '12px',
		margin: `${token('space.025', '2px')} 0`,
		padding: `0 ${token('space.050', '4px')}`,
		backgroundColor: token('color.background.neutral', '#091E420F'),
		color: token('color.text', '#172B4D'),
	},
});

const customMd = md.customize({
	renderers: {
		link: (props: { href?: string; title?: string; children?: object }) => {
			const { href, title, children } = props;
			const url = toAbsolutePath(href);
			return React.createElement('a', { href: url, title }, children);
		},
	},
});

const withCustomStyles =
	(tag: Function) =>
	(strings: TemplateStringsArray, ...args: React.ReactNode[]) => (
		<div css={styles}>{tag(strings, ...args)}</div>
	);

export default withCustomStyles(customMd);
