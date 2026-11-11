/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger'),
	paddingInlineStart: token('space.025'),
});

const semanticRequiredIndicatorStyles = css({
	paddingInlineStart: token('space.inset.xxsmall'),
});

export default function RequiredIndicator(): JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<span
			css={[
				requiredIndicatorStyles,
				fg('platform-semantic-spacing') && semanticRequiredIndicatorStyles,
			]}
			aria-hidden
		>
			*
		</span>
	);
}
