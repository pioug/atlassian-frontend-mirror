import React from 'react';

import { cssMap } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { components, type ControlProps } from '@atlaskit/select';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { withFeatureFlaggedComponent } from '../../../../common/utils/withFeatureFlaggedComponent';

import { type SelectOption } from './types';

const popupCustomControlStylesOld = () => ({
	display: 'flex',
	padding: token('space.050', '4px'),
	border: 'none',
	borderBottom: `solid 1px ${token('color.border', N40)}`,
	minHeight: 'auto',
});

const popupCustomControlStyles = () => ({
	display: 'flex',
	borderRadius: '3px',
	border: `solid 1px ${token('color.border.input', '#8C8F97')}`,
});

const popupCustomControlVisualRefreshStyles = cssMap({
	container: {
		paddingTop: token('space.050', '4px'),
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.100', '4px'),
		paddingRight: token('space.100', '4px'),
	},
});

const controlStylesOld = cssMap({
	root: {
		display: 'flex',
		paddingTop: token('space.050', '4px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.050', '4px'),
		border: 'none',
		borderBottom: `solid 1px ${token('color.border', N40)}`,
		minHeight: 'auto',
		'&:hover': {
			borderBottom: `solid 1px ${token('color.border', N40)}`,
		},
	},
});

export const CustomControlOld = ({ children, ...innerProps }: ControlProps<SelectOption, true>) => (
	<components.Control
		{...innerProps}
		xcss={controlStylesOld.root}
		{...(fg('compiled-react-select')
			? {
					appearance: 'none',
				}
			: // getStyles is not valid approach to override styles, see https://hello.atlassian.net/wiki/spaces/DST/pages/5289062999/New+way+to+style+Atlaskit+Select+with+Compiled+css
				{ getStyles: popupCustomControlStylesOld })}
	>
		{children}
	</components.Control>
);

const controlStyles = cssMap({
	root: {
		display: 'flex',
		borderRadius: '3px',
		borderWidth: token('border.width', '1px'),
		borderStyle: 'solid',
		borderColor: token('color.border.input', '#8C8F97'),
		'&:hover': {
			borderWidth: token('border.width', '1px'),
			borderStyle: 'solid',
			borderColor: token('color.border.input', '#8C8F97'),
		},
	},
});

export const CustomControl = ({ children, ...innerProps }: ControlProps<SelectOption, true>) => (
	<Box xcss={popupCustomControlVisualRefreshStyles.container}>
		<components.Control
			{...innerProps}
			{...(fg('compiled-react-select')
				? {
						appearance: 'none',
						isCompact: true,
					}
				: // getStyles is not valid approach to override styles, see https://hello.atlassian.net/wiki/spaces/DST/pages/5289062999/New+way+to+style+Atlaskit+Select+with+Compiled+css
					{ getStyles: popupCustomControlStyles })}
			xcss={controlStyles.root}
		>
			{children}
		</components.Control>
	</Box>
);

export default withFeatureFlaggedComponent(CustomControlOld, CustomControl, () =>
	fg('platform-linking-visual-refresh-sllv'),
);
