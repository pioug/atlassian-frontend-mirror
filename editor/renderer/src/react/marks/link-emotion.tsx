/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion branch of the `platform_editor_static_css` experiment.
 * Used via `componentWithCondition` in `link.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ComponentProps } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration; `jsx` is used as the JSX pragma (see @jsx jsx above) so must be a value import
import { css, jsx } from '@emotion/react';

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

export const LinkUrlEmotion = (props: ComponentProps<typeof LinkUrl>): jsx.JSX.Element => (
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	<LinkUrl css={anchorStyles} {...props} />
);
