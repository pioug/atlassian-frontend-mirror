import React from 'react';

import type { Link } from '@atlaskit/linking-types/datasource';
import LinkUrl from '@atlaskit/smart-card/link-url';

/**
 * Wraps the given cell `children` in a `LinkUrl` pointing at the issue URL,
 * making the cell's contents (e.g. the issue type icon) act as a link to the
 * issue. If `issueLinkData` is missing, returns `children` unchanged so the
 * caller doesn't need to branch on linkability.
 */
export const getLinkedCellContent: any = ({
	children,
	issueLinkData,
}: {
	children: React.ReactNode;
	issueLinkData?: Link;
}) => {
	if (!issueLinkData) {
		return children;
	}

	return (
		<LinkUrl
			href={issueLinkData.url}
			target="_blank"
			aria-label={issueLinkData.text || issueLinkData.url}
			data-testid={'issue-like-table-type-icon-link'}
		>
			{children}
		</LinkUrl>
	);
};
