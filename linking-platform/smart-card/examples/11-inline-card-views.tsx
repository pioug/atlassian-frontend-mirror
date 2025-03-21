import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import { HelperMessage } from '@atlaskit/form';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

const styles = cssMap({
	boxStyles: {
		width: '300px',
	},
});

type FontOptions = { label: string; value: string | undefined };
export default () => {
	const [fontOption, setFontOption] = React.useState<FontOptions | undefined>();
	const [widthPercentage, setWidthPercentage] = React.useState<number>(100);
	const [truncateInline, setTruncateInline] = React.useState(false);

	return (
		<ExampleContainer title="InlineCard Views">
			<Stack space="space.100">
				<Inline space="space.200" alignBlock="start">
					<Box xcss={styles.boxStyles}>
						<Select<FontOptions>
							options={[
								{ label: 'none', value: undefined },
								{ label: 'font.body.small', value: token('font.body.small') },
								{ label: 'font.body', value: token('font.body') },
								{ label: 'font.body.large', value: token('font.body.large') },
								{ label: 'font.heading.xxsmall', value: token('font.heading.xxsmall') },
								{ label: 'font.heading.xsmall', value: token('font.heading.xsmall') },
								{ label: 'font.heading.small', value: token('font.heading.small') },
								{ label: 'font.heading.medium', value: token('font.heading.medium') },
								{ label: 'font.heading.large', value: token('font.heading.large') },
								{ label: 'font.heading.xlarge', value: token('font.heading.xlarge') },
								{ label: 'font.heading.xxlarge', value: token('font.heading.xxlarge') },
							]}
							onChange={(option) => option && setFontOption(option)}
							value={fontOption}
						/>
						<HelperMessage>Set parent container font token.</HelperMessage>
					</Box>
					<Box>
						<Checkbox
							isChecked={truncateInline}
							label="Truncate"
							onChange={() => setTruncateInline((current) => !current)}
						/>
					</Box>
				</Inline>
				<Box>
					<Range
						aria-label="controlled range"
						step={1}
						value={widthPercentage}
						onChange={(value) => setWidthPercentage(value)}
					/>
					<HelperMessage>
						Change container width to see how inline card wrapping to next line.
					</HelperMessage>
				</Box>
				<Box style={{ width: `${widthPercentage}%`, font: fontOption?.value }}>
					<CardViewExample
						appearance="inline"
						showHoverPreview={true}
						truncateInline={truncateInline}
					/>
				</Box>
			</Stack>
		</ExampleContainer>
	);
};
