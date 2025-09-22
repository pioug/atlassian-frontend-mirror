/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { type IconTileProps } from '@atlaskit/icon/types';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { paddingBlock: token('space.200'), paddingInline: token('space.200') },
});

const IconTileNewExample = () => {
	const sizes: IconTileProps['size'][] = [
		undefined,
		'xsmall',
		'small',
		'medium',
		'large',
		'xlarge',
	];
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

	return (
		<Stack space="space.200" alignInline="start" xcss={styles.root}>
			{sizes.map((size, index) => (
				<Fragment key={size || `default-${index}`}>
					<Heading size="medium">Size: {size || 'default'}</Heading>
					<Inline space="space.100" shouldWrap={true}>
						{appearances.map((appearance) => (
							<IconTile
								key={appearance}
								icon={GlobeIcon}
								label=""
								appearance={appearance}
								size={size}
							/>
						))}
					</Inline>
				</Fragment>
			))}
		</Stack>
	);
};

export default IconTileNewExample;
