/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';

import Drawer from '../../src';

const checkboxStyles = xcss({
	paddingBlockStart: 'space.200',
});

const DrawerUnmountExample = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [shouldUnmount, setShouldUnmount] = useState<boolean>(false);

	return (
		<Fragment>
			<Drawer
				shouldUnmountOnExit={shouldUnmount}
				onClose={() => setOpen(false)}
				isOpen={open}
				width="medium"
			>
				<p>Type something below to see if the state is retained</p>
				<TextArea />
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
			<Box xcss={checkboxStyles}>
				<Checkbox
					label={
						<Fragment>
							Should unmount on exit. The drawer{' '}
							<strong>{shouldUnmount ? 'loses' : 'retains'}</strong> its state on close
						</Fragment>
					}
					onChange={(e) => setShouldUnmount(e.currentTarget.checked)}
				/>
			</Box>
		</Fragment>
	);
};

export default DrawerUnmountExample;
