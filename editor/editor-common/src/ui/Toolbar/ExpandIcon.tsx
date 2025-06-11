/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';

const expandIconContainerStyle = css({
	display: 'flex',
	alignItems: 'center',
});

export function ToolbarExpandIcon() {
	return (
		<span css={expandIconContainerStyle}>
			<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" size="small" />
		</span>
	);
}
