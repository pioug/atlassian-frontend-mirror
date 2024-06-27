/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';
import { type DrawerWidth } from '../src/components/types';
import { widths } from '../src/constants';

const buttonContainerStyles = css({
	display: 'flex',
	gap: token('space.200', '1rem'),
});

const DrawersExample = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [width, setWidth] = useState<DrawerWidth>('narrow');

	const openDrawer = (updatedWidth: DrawerWidth) => () => {
		setIsDrawerOpen(true);
		setWidth(updatedWidth);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '2rem' }}>
			<Drawer
				testId="widths"
				onClose={closeDrawer}
				isOpen={isDrawerOpen}
				width={width}
				label={`Drawer ${width}`}
			>
				<code
					id="drawerContents"
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						textTransform: 'capitalize',
					}}
				>{`${width} drawer contents`}</code>
			</Drawer>
			<div css={buttonContainerStyles}>
				{widths.map((width) => (
					<Button
						onClick={openDrawer(width)}
						type="button"
						key={width}
						id={`open-${width}-drawer`}
					>{`Open ${width} Drawer`}</Button>
				))}
			</div>
		</div>
	);
};

export default DrawersExample;
