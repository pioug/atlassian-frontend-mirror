/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import type { DrawerWidth } from '@atlaskit/drawer/types';
import { token } from '@atlaskit/tokens';

const widths: DrawerWidth[] = ['narrow', 'medium', 'wide', 'extended', 'full'];

const buttonContainerStyles = css({
	display: 'flex',
	gap: token('space.200'),
});

const DrawersExample: () => JSX.Element = () => {
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
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Code
						id="drawerContents"
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textTransform: 'capitalize',
						}}
					>{`${width} drawer contents`}</Code>
				</DrawerContent>
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
