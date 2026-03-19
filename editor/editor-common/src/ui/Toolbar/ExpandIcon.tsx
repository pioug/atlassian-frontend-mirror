/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

const expandIconContainerStyle = css({
	display: 'flex',
	alignItems: 'center',
});

export function ToolbarExpandIcon(): JSX.Element {
	return (
		<span css={expandIconContainerStyle}>
			<ChevronDownIcon label="" color="currentColor" size="small" />
		</span>
	);
}
