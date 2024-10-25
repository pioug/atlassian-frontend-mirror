import React, { useState } from 'react';

import Heading from '@atlaskit/heading';
import { Box, Flex, Inline, type Space, Stack, xcss } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

const boxStyles = xcss({
	display: 'block',
	justifyContent: 'start',
	color: 'color.text',
	borderColor: 'color.border.discovery',
	borderStyle: 'solid',
	borderRadius: '3px',
	borderWidth: 'border.width',
});

const spacingValues: Space[] = [
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
];

export default function Example() {
	const [padding, setPadding] = useState(6);
	const [paddingInline, setPaddingInline] = useState(6);
	const [paddingInlineStart, setPaddingInlineStart] = useState(6);
	const [paddingInlineEnd, setPaddingInlineEnd] = useState(6);
	const [paddingBlock, setPaddingBlock] = useState(6);
	const [paddingBlockStart, setPaddingBlockStart] = useState(6);
	const [paddingBlockEnd, setPaddingBlockEnd] = useState(6);

	return (
		<Inline space="space.200">
			<Stack grow="fill">
				<Heading size="medium" id="box-padding">
					padding
				</Heading>
				<Box>{spacingValues[padding]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={padding}
					onChange={(padding) => setPadding(padding)}
					aria-labelledby="box-padding"
				/>

				<Flex>
					<Box
						backgroundColor="color.background.discovery"
						xcss={boxStyles}
						padding={spacingValues[padding]}
					>
						Content
					</Box>
				</Flex>
			</Stack>

			<Stack grow="fill">
				<Heading size="medium" id="box-padding-inline">
					paddingInline
				</Heading>
				<Box>{spacingValues[paddingInline]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingInline}
					onChange={(paddingInline) => setPaddingInline(paddingInline)}
					aria-labelledby="box-padding-inline"
				/>

				<Heading size="medium" id="box-padding-block">
					paddingBlock
				</Heading>
				<Box>{spacingValues[paddingBlock]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingBlock}
					onChange={(paddingBlock) => setPaddingBlock(paddingBlock)}
					aria-labelledby="box-padding-block"
				/>

				<Flex>
					<Box
						backgroundColor="color.background.discovery"
						xcss={boxStyles}
						paddingInline={spacingValues[paddingInline]}
						paddingBlock={spacingValues[paddingBlock]}
					>
						Content
					</Box>
				</Flex>
			</Stack>

			<Stack grow="fill">
				<Heading size="medium" id="box-padding-inline-start">
					paddingInlineStart
				</Heading>
				<Box>{spacingValues[paddingInlineStart]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingInlineStart}
					onChange={(paddingInlineStart) => setPaddingInlineStart(paddingInlineStart)}
					aria-labelledby="box-padding-inline-start"
				/>

				<Heading size="medium" id="box-padding-inline-end">
					paddingInlineEnd
				</Heading>
				<Box>{spacingValues[paddingInlineEnd]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingInlineEnd}
					onChange={(paddingInlineEnd) => setPaddingInlineEnd(paddingInlineEnd)}
					aria-labelledby="box-padding-inline-end"
				/>

				<Heading size="medium" id="box-padding-block-start">
					paddingBlockStart
				</Heading>
				<Box>{spacingValues[paddingBlockStart]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingBlockStart}
					onChange={(paddingBlockStart) => setPaddingBlockStart(paddingBlockStart)}
					aria-labelledby="box-padding-block-start"
				/>

				<Heading size="medium" id="box-padding-block-end">
					paddingBlockEnd
				</Heading>
				<Box>{spacingValues[paddingBlockEnd]}</Box>
				<Range
					max={spacingValues.length - 1}
					step={1}
					value={paddingBlockEnd}
					onChange={(paddingBlockEnd) => setPaddingBlockEnd(paddingBlockEnd)}
					aria-labelledby="box-padding-block-end"
				/>

				<Flex>
					<Box
						backgroundColor="color.background.discovery"
						xcss={boxStyles}
						paddingBlockStart={spacingValues[paddingBlockStart]}
						paddingBlockEnd={spacingValues[paddingBlockEnd]}
						paddingInlineStart={spacingValues[paddingInlineStart]}
						paddingInlineEnd={spacingValues[paddingInlineEnd]}
					>
						Content
					</Box>
				</Flex>
			</Stack>
		</Inline>
	);
}
