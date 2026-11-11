/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger'),
	fontFamily: token('font.family.body'),
	paddingInlineStart: token('space.025'),
});

const semanticRequiredIndicatorStyles = css({
	paddingInlineStart: token('space.inset.xxsmall'),
});

export function RequiredAsterisk(): JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<span
			css={[
				requiredIndicatorStyles,
				fg('platform-semantic-spacing') && semanticRequiredIndicatorStyles,
			]}
			aria-hidden="true"
			title="required"
		>
			*
		</span>
	);
}
