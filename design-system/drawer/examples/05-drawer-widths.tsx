/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Drawer, {
	DrawerCloseButton,
	DrawerContent,
	DrawerSidebar,
	type DrawerWidth,
} from '@atlaskit/drawer';
import { widths } from '@atlaskit/drawer/constants';
import { token } from '@atlaskit/tokens';

const buttonContainerStyles = css({
	display: 'flex',
	gap: token('space.200', '1rem'),
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

export const DrawerWidthNarrowExample: () => JSX.Element = () => (
	<Drawer label="narrow" width="narrow" isOpen />
);
export const DrawerWidthMediumExample: () => JSX.Element = () => (
	<Drawer label="medium" width="medium" isOpen />
);
export const DrawerWidthWideExample: () => JSX.Element = () => (
	<Drawer label="wide" width="wide" isOpen />
);
export const DrawerWidthExtendedExample: () => JSX.Element = () => (
	<Drawer label="extended" width="extended" isOpen />
);
export const DrawerWidthFullExample: () => JSX.Element = () => (
	<Drawer label="full" width="full" isOpen />
);

export default DrawersExample;
