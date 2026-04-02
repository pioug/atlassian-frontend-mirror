import React from 'react';

import Button from '@atlaskit/button';
import { cssMap } from '@atlaskit/css';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';


const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const ButtonWithIconOnlyExample = (): React.JSX.Element => {
	return (
		<Button
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<StarStarredIcon label="" />
				</Flex>
			}
			appearance="primary"
			aria-label="Unstar this page"
		/>
	);
};

export default ButtonWithIconOnlyExample;
