/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import EditorPanelIcon from '@atlaskit/icon/core/migration/information--editor-panel';
import { N50, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const wrapper = css({
	display: 'flex',
	marginRight: token('space.050', '4px'),
});

export default () => {
	const [isMouseHovered, setHoverState] = useState(false);
	const onMouseEnter = useCallback(() => setHoverState(true), [setHoverState]);
	const onMouseLeave = useCallback(() => setHoverState(false), [setHoverState]);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div css={wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<EditorPanelIcon
				testId="source-icon"
				label=""
				LEGACY_size="large"
				LEGACY_margin={`0 ${token('space.negative.050')} 0 0`}
				spacing="spacious"
				color={token('color.text.subtlest', isMouseHovered ? N200 : N50)}
			/>
		</div>
	);
};
