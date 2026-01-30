/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const containerStylesBrandBoldest = css({
	backgroundColor: token('color.background.brand.boldest'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const containerStylesWarningBold = css({
	backgroundColor: token('color.background.warning.bold'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const _default: () => JSX.Element = () => {
	return (
		<Stack space="space.100">
			{/* Purposefully not using a Box in order to show manually setting Heading color */}
			<div css={containerStylesBrandBoldest}>
				<Heading size="large" color="color.text.inverse">
					Heading color can be manually inverted.
				</Heading>
			</div>
			<div css={containerStylesWarningBold}>
				<Heading size="large" color="color.text.warning.inverse">
					Heading color can be manually inverted.
				</Heading>
			</div>
		</Stack>
	);
};
export default _default;
