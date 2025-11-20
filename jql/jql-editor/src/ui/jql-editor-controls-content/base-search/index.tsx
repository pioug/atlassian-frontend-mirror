import React, { type CSSProperties, useCallback } from 'react';

import { LoadingButton } from '@atlaskit/button';
import { IconButton } from '@atlaskit/button/new';
import SearchIcon from '@atlaskit/icon/core/migration/search--editor-search';
import { fg } from '@atlaskit/platform-feature-flags';
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

// Fixes an issue where loading button makes the editor flicker with a scrollbar
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

	return fg('platform-component-visual-refresh') ? (
		<>
			<Box xcss={buttonContainerStyle}>
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
					{...(fg('add_nin_press_interactions') && {
						interactionName: 'jql-editor-base-search-button',
					})}
				/>
			</Box>
		</>
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
						<SearchIcon
							color="currentColor"
							label={''}
							LEGACY_size={'medium'}
							LEGACY_margin="-4px"
						/>
					</Box>
				}
				{...(fg('add_nin_press_interactions') && {
					interactionName: 'jql-editor-base-search-button',
				})}
			/>
		</>
	);
};
