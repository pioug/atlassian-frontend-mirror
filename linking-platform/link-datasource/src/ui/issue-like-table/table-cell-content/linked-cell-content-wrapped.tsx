import React from 'react';

import type { Link } from '@atlaskit/linking-types/datasource';
import LinkUrl from '@atlaskit/smart-card/link-url';

import { useDatasourceCrossProductAttribution } from '../../../analytics/xpc/useDatasourceCrossProductAttribution';

export const LinkedCellContentWrapped = ({
	children,
	issueLinkData,
}: {
	children: React.ReactNode;
	issueLinkData?: Link;
}): React.JSX.Element => {
	const { wrapCrossProductUrl } = useDatasourceCrossProductAttribution();

	if (!issueLinkData) {
		return <>{children}</>;
	}

	return (
		<LinkUrl
			href={wrapCrossProductUrl(issueLinkData.url)}
			target="_blank"
			aria-label={issueLinkData.text || issueLinkData.url}
			data-testid={'issue-like-table-type-icon-link'}
		>
			{children}
		</LinkUrl>
	);
};
