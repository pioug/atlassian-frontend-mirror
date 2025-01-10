/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import ChildIssuesIcon from '@atlaskit/icon/core/migration/child-issues';
import { fg } from '@atlaskit/platform-feature-flags';

import RelatedLinksActionIconOld from './RelatedLinksActionIconOld';

const rotateSvg = css({
	transform: 'rotate(180deg)',
	display: 'inline-block',
});

/**
 * ChildIssuesIcon but 180 degrees rotated
 */
const RelatedLinksActionIconNew = () => (
	<span css={rotateSvg}>
		<ChildIssuesIcon color="currentColor" spacing="spacious" label="View recent links..." />
	</span>
);

const RelatedLinksActionIcon = (): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinksActionIconNew />;
	}
	return <RelatedLinksActionIconOld />;
};

export default RelatedLinksActionIcon;
