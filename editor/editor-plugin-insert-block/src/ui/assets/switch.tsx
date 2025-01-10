/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import RefreshIcon from '@atlaskit/icon/core/migration/refresh';

const iconStyle = css({
	transform: 'rotate(-90deg)',
});

export default function SwitchIcon() {
	return (
		<span css={iconStyle}>
			<RefreshIcon label="" />
		</span>
	);
}
