/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { type IconTileProps } from '@atlaskit/icon/types';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { paddingBlock: token('space.200'), paddingInline: token('space.200') },
	gridContainer: {
		gridTemplateColumns: 'auto 1fr',
	},
});

const IconTileExample = (): JSX.Element => {
	const sizes: IconTileProps['size'][] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
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
			{sizes.map((size) => (
				<Stack space="space.200" key={size}>
					<Heading size="small">Size: {size}</Heading>
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
				</Stack>
			))}
		</Stack>
	);
};

export default IconTileExample;
