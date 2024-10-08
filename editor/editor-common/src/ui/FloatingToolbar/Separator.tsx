/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const separator = css({
	background: token('color.border'),
	width: '1px',
	height: '20px',
	margin: `0 ${token('space.050', '4px')}`,
	alignSelf: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
export default () => <div css={separator} className="separator" />;
