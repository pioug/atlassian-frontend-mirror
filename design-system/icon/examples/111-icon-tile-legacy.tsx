/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type FunctionComponent, useEffect, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { type IconTileProps, type NewCoreIconProps } from '@atlaskit/icon/types';
import { Grid, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { paddingBlock: token('space.200'), paddingInline: token('space.200') },
	gridContainer: {
		gridTemplateColumns: 'auto 1fr',
	},
});

const IconTileLegacyExample = (): JSX.Element => {
	const [NewFeatureIconObject, setNewFeatureIconObject] = useState<
		FunctionComponent<NewCoreIconProps> | undefined
	>(undefined);

	useEffect(() => {
		// eslint-disable-next-line import/dynamic-import-chunkname
		import('@atlaskit/icon-object/glyph/new-feature/24').then((module) => {
			setNewFeatureIconObject(
				() => module.default as unknown as FunctionComponent<NewCoreIconProps>,
			);
		});
	});

	const sizes: IconTileProps['size'][] = ['16', '24', '32', '40', '48'];
	const appearances = [
		'gray',
		'grayBold',
		'red',
		'redBold',
		'orange',
		'orangeBold',
		'yellow',
		'yellowBold',
		'lime',
		'limeBold',
		'green',
		'greenBold',
		'teal',
		'tealBold',
		'blue',
		'blueBold',
		'purple',
		'purpleBold',
		'magenta',
		'magentaBold',
	] as const;
	const shapes: IconTileProps['shape'][] = ['square', 'circle'];

	return (
		<Stack space="space.200" alignInline="start" xcss={styles.root}>
			{sizes.map((size) => (
				<Stack space="space.200" key={size}>
					<Heading size="small">Size: {size}</Heading>
					<Grid gap="space.200" alignItems="start" xcss={styles.gridContainer}>
						{shapes.map((shape) => (
							<Fragment key={shape}>
								<Heading size="xsmall">Shape: {shape}</Heading>
								<Inline space="space.100" shouldWrap={true}>
									{appearances.map((appearance) => (
										<IconTile
											key={appearance}
											icon={GlobeIcon}
											label=""
											appearance={appearance}
											size={size}
											shape={shape}
										/>
									))}
								</Inline>
							</Fragment>
						))}
					</Grid>
				</Stack>
			))}
			<Heading size="medium">Example using LEGACY_fallbackComponent</Heading>
			<IconTile
				icon={GlobeIcon}
				label=""
				appearance="greenBold"
				shape="square"
				size="24"
				LEGACY_fallbackComponent={
					NewFeatureIconObject ? <NewFeatureIconObject label="" /> : undefined
				}
			/>
			<Heading size="medium">Example using UNSAFE_circleReplacementComponent</Heading>
			<IconTile
				icon={GlobeIcon}
				label=""
				appearance="orangeBold"
				shape="circle"
				size="24"
				UNSAFE_circleReplacementComponent={<span>Circle replacement</span>}
			/>
		</Stack>
	);
};

export default IconTileLegacyExample;
