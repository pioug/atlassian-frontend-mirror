import React from 'react';

import Search from '@atlaskit/icon/core/search';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

type OnChangeType = React.ComponentProps<typeof Textfield>['onChange'];

const searchPanelStyles = xcss({
	paddingTop: 'space.200',
	paddingBottom: 'space.100',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

const searchIconStyles = xcss({
	paddingTop: 'space.050',
	paddingBottom: 'space.0',
	paddingLeft: 'space.100',
	paddingRight: 'space.0',
});

export const SearchPanel = ({ onChange }: { onChange: OnChangeType }) => {
	return (
		<Box xcss={[searchPanelStyles]}>
			<Textfield
				name="search"
				id="search-textfield"
				placeholder="Find or describe"
				elemBeforeInput={
					<Box xcss={searchIconStyles}>
						<Search label="search" color={token('color.text.subtlest')} />
					</Box>
				}
				onChange={onChange}
			/>
		</Box>
	);
};
