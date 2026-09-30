import React, { type CSSProperties, useCallback } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import LoadingButton from '@atlaskit/button/loading-button';
import SearchIcon from '@atlaskit/icon/core/search';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const style: CSSProperties = {
	// Fixes an issue where loading button makes the editor flicker with a scrollbar
	overflow: 'hidden',
};
// Fixes icon margin issus after new icon migration
const iconStyle = xcss({
	margin: 'space.050',
	display: 'flex',
});

/**
 * Fixes an issue where loading button makes the editor flicker with a scrollbar.
 *
 * This clips the button's focus ring, which is painted outside the border box
 * (`outline-width: 2px` + `outline-offset: 2px`), leaving no visible focus indicator.
 * `IconButton` already contains its own loading spinner in an inset, `overflow: hidden`
 * overlay, so this container is redundant and is removed under the
 * `a11y-oct-22nd-batch` experiment. See A11Y-35618.
 */
const buttonContainerStyle = xcss({
	overflow: 'hidden',
});

type Props = {
	isDisabled?: boolean;
	isSearching?: boolean;
	label: string;
	onSearch: () => void;
};

export const BaseSearch = ({
	isDisabled,
	isSearching,
	label,
	onSearch,
}: Props): React.JSX.Element => {
	// Prevent click events being repeatedly fired if the Enter key is held down.
	const preventRepeatClick = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && e.repeat) {
			e.preventDefault();
		}
	}, []);

	const searchButton = (
		<IconButton
			label={label}
			isDisabled={isDisabled}
			testId="jql-editor-search"
			appearance="default"
			spacing="compact"
			onClick={onSearch}
			onKeyDown={preventRepeatClick}
			isLoading={isSearching}
			icon={SearchIcon}
			interactionName="jql-editor-base-search-button"
		/>
	);

	return fg('platform-component-visual-refresh') ? (
		// Rendering the button without the clipping container keeps its focus ring visible.
		isExperimentEnabled('a11y-oct-22nd-batch') ? (
			searchButton
		) : (
			<Box xcss={buttonContainerStyle}>{searchButton}</Box>
		)
	) : (
		<>
			<LoadingButton
				aria-label={label}
				isDisabled={isDisabled}
				testId="jql-editor-search"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				appearance={'primary'}
				spacing={'none'}
				onClick={onSearch}
				onKeyDown={preventRepeatClick}
				isLoading={isSearching}
				iconBefore={
					<Box xcss={iconStyle}>
						<SearchIcon color="currentColor" label={''} />
					</Box>
				}
				interactionName="jql-editor-base-search-button"
			/>
		</>
	);
};
