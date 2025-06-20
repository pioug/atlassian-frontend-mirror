import React, { useCallback, useState } from 'react';

import { useLegacySearchTheme } from '@atlaskit/navigation-system/experimental/use-legacy-search-theme';
import {
	EnlargedSearchInput,
	SearchAnchor,
	SearchInput,
	type SearchTheme,
	ThemeProvider as SearchThemeProvider,
} from '@atlassian/search-dialog';

export const MockSearch = ({
	theme,
	isEnlarged = false,
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
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const expand = useCallback(() => {
		setIsExpanded(true);
	}, []);

	const collapse = useCallback(() => {
		setIsExpanded(false);
	}, []);

	const legacySearchTheme = useLegacySearchTheme();

	return (
		<SearchThemeProvider
			value={
				// Not ideal we still call `useLegacySearchTheme` even if a theme is provided, but also not a big deal.
				theme ?? legacySearchTheme
			}
		>
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
		</SearchThemeProvider>
	);
};
