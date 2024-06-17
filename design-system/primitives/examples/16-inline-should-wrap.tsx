/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const fixedSizeContainerStyles = css({ maxWidth: '300px' });
const blockStyles = xcss({ borderRadius: 'border.radius.050' });

export default () => (
	<Box testId="inline-example" padding="space.100">
		<div css={fixedSizeContainerStyles}>
			<Stack space="space.200">
				<div>
					true
					<Box xcss={blockStyles} padding="space.050" backgroundColor="color.background.neutral">
						<Inline space="space.200" shouldWrap={true}>
							{[...Array(25)].map((_, index) => (
								<Box
									key={index}
									xcss={blockStyles}
									padding="space.200"
									backgroundColor="color.background.discovery.bold"
								/>
							))}
						</Inline>
					</Box>
				</div>
				<div>
					false
					<Box xcss={blockStyles} padding="space.050" backgroundColor="color.background.neutral">
						<Inline space="space.200" shouldWrap={false}>
							{[...Array(25)].map((_, index) => (
								<Box
									key={index}
									xcss={blockStyles}
									padding="space.200"
									backgroundColor="color.background.discovery.bold"
								/>
							))}
						</Inline>
					</Box>
				</div>
			</Stack>
		</div>
	</Box>
);
