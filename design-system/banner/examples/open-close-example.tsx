/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/glyph/warning';

const Icon = <WarningIcon label="Warning" secondaryColor="inherit" />;

export default () => {
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
