import React, { memo } from 'react';

import Search from '@atlaskit/icon/core/search';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

type OnChangeType = React.ComponentProps<typeof Textfield>['onChange'];

const searchPanelStyles = xcss({
	paddingTop: 'space.025',
	paddingBottom: 'space.150',
	paddingLeft: 'space.300',
	paddingRight: 'space.300',
});

const searchIconStyles = xcss({
	paddingTop: 'space.050',
	paddingBottom: 'space.0',
	paddingLeft: 'space.100',
	paddingRight: 'space.0',
});

export const SearchPanel = memo(({ onChange }: { onChange: OnChangeType }): React.JSX.Element => {
	return (
		<Box xcss={[searchPanelStyles]}>
			<Textfield
				name="search"
				id="search-textfield"
				placeholder="Find or describe..."
				elemBeforeInput={
					<Box xcss={searchIconStyles}>
						<Search label="search" color={token('color.text.subtlest')} />
					</Box>
				}
				onChange={onChange}
			/>
		</Box>
	);
});
