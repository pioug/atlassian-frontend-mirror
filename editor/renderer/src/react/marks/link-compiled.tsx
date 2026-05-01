/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_static_css` experiment.
 * Used via `componentWithCondition` in `link.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ComponentProps } from 'react';

import { css, jsx } from '@compiled/react';

import LinkUrl from '@atlaskit/smart-card/link-url';
import { token } from '@atlaskit/tokens';

const anchorStyles = css({
	color: token('color.link'),
	'&:hover': {
		color: token('color.link'),
		textDecoration: 'underline',
	},
	'&:active': {
		color: token('color.link.pressed'),
	},
});

export const LinkUrlCompiled = (props: ComponentProps<typeof LinkUrl>): JSX.Element => (
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	<LinkUrl css={anchorStyles} {...props} />
);
