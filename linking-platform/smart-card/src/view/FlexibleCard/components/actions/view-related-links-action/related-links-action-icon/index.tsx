/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import ChildIssuesIcon from '@atlaskit/icon/core/migration/child-issues';

const rotateSvg = css({
	transform: 'rotate(180deg)',
	display: 'inline-block',
});

/**
 * ChildIssuesIcon but 180 degrees rotated
 */
const RelatedLinksActionIcon = () => (
	<span css={rotateSvg}>
		<ChildIssuesIcon color="currentColor" spacing="spacious" label="View recent links..." />
	</span>
);

export default RelatedLinksActionIcon;
