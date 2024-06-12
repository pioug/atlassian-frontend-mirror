import React, { Fragment } from 'react';
import { type NewIconProps } from '../src/types';

import { IconTile } from '../src';
import AddIcon from '../core/add';

import { Inline, Stack, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';

const styles = xcss({ padding: 'space.200' });
const IconSizeExample = () => {
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
			<Heading size="small">Icon Tile</Heading>
			{sizes.map((size) => (
				<>
					<Heading size="xsmall">Size: {size}</Heading>
					<Inline space="space.100" shouldWrap={true} key={size}>
						{appearances.map((appearance) => (
							<Fragment key={appearance}>
								{shapes.map((shape) => (
									<IconTile
										key={shape}
										icon={(props: NewIconProps) => <AddIcon {...props} />}
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
		</Stack>
	);
};

export default IconSizeExample;
