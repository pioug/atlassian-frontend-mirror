/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const spaceItems = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
] as const;

const spaceValueStyles = css({ minWidth: token('space.1000', '80px') });
const blockStyles = xcss({ borderRadius: 'radius.xsmall' });
const containerStyles = xcss({ width: 'size.300' });

export default (): jsx.JSX.Element => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.1000">
			<Stack space="space.100" testId="inline-space">
				<Heading size="large">space</Heading>
				{spaceItems.map((space) => (
					<Inline>
						<span css={spaceValueStyles}>{space}</span>
						<Inline space={space}>
							<Box
								xcss={blockStyles}
								padding="space.200"
								backgroundColor="color.background.discovery.bold"
							/>
							<Box
								xcss={blockStyles}
								padding="space.200"
								backgroundColor="color.background.discovery.bold"
							/>
						</Inline>
					</Inline>
				))}
			</Stack>

			<Stack space="space.100" testId="inline-rowSpace">
				<Heading size="large">rowSpace</Heading>
				{spaceItems.map((space) => (
					<Box xcss={containerStyles}>
						<Inline>
							<span css={spaceValueStyles}>{space}</span>
							<Inline rowSpace={space} shouldWrap>
								<Box
									xcss={blockStyles}
									padding="space.200"
									backgroundColor="color.background.discovery.bold"
								/>
								<Box
									xcss={blockStyles}
									padding="space.200"
									backgroundColor="color.background.discovery.bold"
								/>
							</Inline>
						</Inline>
					</Box>
				))}
			</Stack>
		</Inline>
	</Box>
);
