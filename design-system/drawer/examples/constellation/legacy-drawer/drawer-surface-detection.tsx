/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
	position: 'relative',
});

const contentStyles = css({
	padding: token('space.100'),
});

const headerStyles = css({
	padding: token('space.100'),
	position: 'sticky',
	backgroundColor: token('utility.elevation.surface.current'),
	borderBlockEnd: `1px solid ${token('color.border')}`,
	boxShadow: token('elevation.shadow.overflow'),
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
});

const DrawerSurfaceDetectionExample = () => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Fragment>
			<Drawer onClose={() => setOpen(false)} isOpen={open} titleId="drawerTitle">
				<div css={wrapperStyles}>
					<div css={headerStyles}>
						<h1 id="drawerTitle">Header overlay</h1>
					</div>
					<div css={contentStyles}>
						<Lorem count={10} />
					</div>
				</div>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
		</Fragment>
	);
};

export default DrawerSurfaceDetectionExample;
