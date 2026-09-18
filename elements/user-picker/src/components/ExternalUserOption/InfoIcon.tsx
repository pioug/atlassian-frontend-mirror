/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// oxlint-disable-next-line typescript(consistent-type-imports) -- `jsx` is the runtime factory required by the classic JSX pragma.
import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766

import EditorPanelIcon from '@atlaskit/icon/core/status-information';
import { token } from '@atlaskit/tokens';

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
