/** @jsx jsx */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

const contentStyles = css({
	padding: token('space.100', '8px'),
	position: 'relative',
});

const headerStyles = css({
	padding: token('space.100', '8px'),
	position: 'absolute',
	backgroundColor: token('utility.elevation.surface.current'),
	borderBlockEnd: `1px solid ${token('color.border')}`,
	boxShadow: token('elevation.shadow.overflow'),
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
});

const DrawerSurfaceDetectionExample = () => {
	const [open, setOpen] = useState<boolean>(true);

	return (
		<Fragment>
			<Drawer onClose={() => setOpen(false)} isOpen={open} label="Surface detection">
				<div css={contentStyles}>
					<div css={headerStyles}>
						<h2>Header overlay</h2>
					</div>
					<Lorem count={2} />
				</div>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
		</Fragment>
	);
};

export default DrawerSurfaceDetectionExample;
