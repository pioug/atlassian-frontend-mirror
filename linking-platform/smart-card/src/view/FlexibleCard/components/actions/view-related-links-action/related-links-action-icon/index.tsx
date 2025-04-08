/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import ClockIcon from '@atlaskit/icon/core/clock';
import ChildIssuesIcon from '@atlaskit/icon/core/migration/child-issues';
import { fg } from '@atlaskit/platform-feature-flags';

const rotateSvg = css({
	transform: 'rotate(180deg)',
	display: 'inline-block',
});

/**
 * ChildIssuesIcon but 180 degrees rotated
 */
const RelatedLinksActionIcon = () =>
	fg('platform-linking-visual-refresh-v2') ? (
		<ClockIcon color="currentColor" spacing="spacious" label="View related links..." />
	) : (
		<span css={rotateSvg}>
			<ChildIssuesIcon color="currentColor" spacing="spacious" label="View recent links..." />
		</span>
	);

export default RelatedLinksActionIcon;
