/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import EditorPanelIcon from '@atlaskit/icon/core/status-information';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

const wrapper = css({
	display: 'flex',
	marginRight: token('space.050'),
});

export default (): jsx.JSX.Element => {
	return (
		<div css={wrapper}>
			<EditorPanelIcon
				testId="source-icon"
				label=""
				spacing="spacious"
				color={token('color.text.subtlest')}
			/>
		</div>
	);
};
