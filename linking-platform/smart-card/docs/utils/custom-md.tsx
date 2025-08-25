/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { md } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import { token } from '@atlaskit/tokens';

import { isRelativePath, toAbsolutePath } from './index';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'code:not([class])': {
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('border.radius.100', '3px'),
		display: 'inline-block',
		font: token('font.body.UNSAFE_small'),
		marginTop: token('space.025', '2px'),
		marginRight: 0,
		marginBottom: token('space.025', '2px'),
		marginLeft: 0,
		paddingTop: 0,
		paddingRight: token('space.050', '4px'),
		paddingBottom: 0,
		paddingLeft: token('space.050', '4px'),
		backgroundColor: token('color.background.neutral', '#091E420F'),
		color: token('color.text', '#172B4D'),
	},
});

const customMd = md.customize({
	renderers: {
		link: (props: { children?: React.ReactNode; href?: string; title?: string }) => {
			const { href, title, children } = props;
			const target = isRelativePath(href) ? '_self' : '_blank';
			const url = toAbsolutePath(href);
			return (
				<Link href={url} target={target} title={title}>
					{children}
				</Link>
			);
		},
	},
});

const withCustomStyles =
	(tag: Function) =>
	(strings: TemplateStringsArray, ...args: React.ReactNode[]) => (
		<div css={styles}>{tag(strings, ...args)}</div>
	);

export default withCustomStyles(customMd);
