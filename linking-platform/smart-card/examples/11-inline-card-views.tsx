import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import { HelperMessage } from '@atlaskit/form';
import { iconTestUrls } from '@atlaskit/link-test-helpers/smart-card';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import Select from '@atlaskit/select';
import { Card } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';
import { useLocalStorageState } from './utils/use-local-storage-state';

const styles = cssMap({
	boxStyles: {
		width: '300px',
	},
});

type FontOptions = { label: string; value: string | undefined };

const FONT_OPTIONS: FontOptions[] = [
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
];

const FONT_OPTION_STORAGE_KEY = 'atlaskit-examples-lp-inline-card-views-font-option-label';
const WIDTH_STORAGE_KEY = 'atlaskit-examples-lp-inline-card-views-width-percentage';
const TRUNCATE_STORAGE_KEY = 'atlaskit-examples-lp-inline-card-views-truncate-inline';

export default (): React.JSX.Element => {
	const [fontOptionLabel, setFontOptionLabel] = useLocalStorageState<string>({
		storageKey: FONT_OPTION_STORAGE_KEY,
		defaultValue: 'none',
		type: 'string',
	});
	const [widthPercentage, setWidthPercentage] = useLocalStorageState<number>({
		storageKey: WIDTH_STORAGE_KEY,
		defaultValue: 100,
		type: 'number',
	});
	const [truncateInline, setTruncateInline] = useLocalStorageState<boolean>({
		storageKey: TRUNCATE_STORAGE_KEY,
		defaultValue: false,
		type: 'boolean',
	});

	const fontOption = FONT_OPTIONS.find((option) => option.label === fontOptionLabel);

	return (
		<ExampleContainer title="InlineCard Views">
			<Stack space="space.100">
				<Inline space="space.200" alignBlock="start">
					<Box xcss={styles.boxStyles}>
						<Select<FontOptions>
							options={FONT_OPTIONS}
							onChange={(newValue: FontOptions | null) =>
								setFontOptionLabel(newValue?.label ?? 'none')
							}
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
						urls={iconTestUrls}
						truncateInline={truncateInline}
						CardComponent={Card}
					/>
				</Box>
			</Stack>
		</ExampleContainer>
	);
};
