/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger'),
	paddingInlineStart: token('space.025'),
});

export default function RequiredIndicator(): JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<span css={requiredIndicatorStyles} aria-hidden>
			*
		</span>
	);
}
