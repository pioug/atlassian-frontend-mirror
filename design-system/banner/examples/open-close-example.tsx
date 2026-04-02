import React, { Fragment, useState } from 'react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const Icon = (
	<Flex xcss={iconSpacingStyles.space050}>
		<WarningIcon label="Warning" />
	</Flex>
);

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Fragment>
			<Button appearance="primary" onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? 'Hide' : 'Show'} banner
			</Button>
			{isOpen && (
				<Banner icon={Icon} appearance="warning">
					This is a warning banner
				</Banner>
			)}
		</Fragment>
	);
};
