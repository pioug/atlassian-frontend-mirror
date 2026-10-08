import React, { type JSX, useCallback, useState } from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { SearchAnchor } from '@atlassian/search-dialog/search-anchor';
import SearchInput from '@atlassian/search-dialog/search-input';
import EnlargedSearchInput from '@atlassian/search-dialog/search-input-enlarged';
import type { SearchTheme } from '@atlassian/search-dialog/theme';

export const MockSearch = ({
	isEnlarged = false,
	size,
}: {
	/**
	 * Optional theme, otherwise will call `useLegacySearchTheme` internally.
	 *
	 * Allowing this for our example that explicitly shows how to theme the search.
	 * Other examples can just rely on the auto-theming.
	 */
	theme?: SearchTheme;

	/**
	 * Optional boolean to determine if an enlarged search input should be rendered.
	 */
	isEnlarged?: boolean;
	size?: number;
}): JSX.Element => {
	const [isExpanded, setIsExpanded] = useState(false);

	const expand = useCallback(() => {
		setIsExpanded(true);
	}, []);

	const collapse = useCallback(() => {
		setIsExpanded(false);
	}, []);

	return (
		<Box style={{ width: size ? `${size}px` : '100%' }}>
			<SearchAnchor shouldFillContainer onBlur={collapse} onFocus={expand} isExpanded={isExpanded}>
				{isEnlarged ? (
					<EnlargedSearchInput
						isExpanded={isExpanded}
						shouldFillContainer
						tooltipContent={<span>Search</span>}
						placeholder="Search"
					/>
				) : (
					<SearchInput
						isExpanded={isExpanded}
						shouldFillContainer
						tooltipContent={<span>Search</span>}
						placeholder="Search"
					/>
				)}
			</SearchAnchor>
		</Box>
	);
};
