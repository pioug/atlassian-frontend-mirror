import React, { Fragment, type FunctionComponent, useEffect, useState } from 'react';

import Heading from '@atlaskit/heading';
import { Inline, Stack, xcss } from '@atlaskit/primitives';

import AddIcon from '../core/add';
import { IconTile } from '../src';
import { type NewCoreIconProps } from '../src/types';

const styles = xcss({ padding: 'space.200' });
const IconSizeExample = () => {
	const [NewFeatureIconObject, setNewFeatureIconObject] = useState<
		FunctionComponent<NewCoreIconProps> | undefined
	>(undefined);

	useEffect(() => {
		// eslint-disable-next-line import/extensions, import/dynamic-import-chunkname
		import('@atlaskit/icon-object/glyph/new-feature/24').then((module) => {
			setNewFeatureIconObject(
				() => module.default as unknown as FunctionComponent<NewCoreIconProps>,
			);
		});
	});

	const sizes = ['16', '24', '32', '40', '48'] as const;
	const appearances = [
		'blue',
		'blueBold',
		'green',
		'greenBold',
		'lime',
		'limeBold',
		'magenta',
		'magentaBold',
		'orange',
		'orangeBold',
		'purple',
		'purpleBold',
		'red',
		'redBold',
		'teal',
		'tealBold',
		'yellow',
		'yellowBold',
		'gray',
		'grayBold',
	] as const;
	const shapes = ['square', 'circle'] as const;

	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			{/* Icon tile examples */}
			<Heading size="medium">All appearances</Heading>
			{sizes.map((size) => (
				<>
					<Heading size="small">Size: {size}</Heading>
					<Inline space="space.100" shouldWrap={true} key={size}>
						{appearances.map((appearance) => (
							<Fragment key={appearance}>
								{shapes.map((shape) => (
									<IconTile
										key={shape}
										icon={AddIcon}
										label=""
										appearance={appearance}
										shape={shape}
										size={size}
									/>
								))}
							</Fragment>
						))}
					</Inline>
				</>
			))}
			<Heading size="medium">Example using LEGACY_fallbackComponent</Heading>
			<IconTile
				icon={AddIcon}
				label=""
				appearance="greenBold"
				shape="square"
				size="24"
				LEGACY_fallbackComponent={
					NewFeatureIconObject ? <NewFeatureIconObject label="" /> : undefined
				}
			/>
		</Stack>
	);
};

export default IconSizeExample;
