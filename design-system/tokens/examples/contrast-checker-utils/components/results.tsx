/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { VariableSizeList as List } from 'react-window';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import TextField from '@atlaskit/textfield';

import rawTokensDark from '../../../src/artifacts/tokens-raw/atlassian-dark';
import rawTokensBrandRefreshDark from '../../../src/artifacts/tokens-raw/atlassian-dark-brand-refresh';
import rawTokensLight from '../../../src/artifacts/tokens-raw/atlassian-light';
import rawTokensBrandRefreshLight from '../../../src/artifacts/tokens-raw/atlassian-light-brand-refresh';
import checkThemePairContrasts, {
	darkResults,
	darkResultsAAA,
	lightResults,
	lightResultsAAA,
} from '../utils/check-pair-contrasts';
import { downloadResultsAsCSV } from '../utils/csv-generator';
import { type ColorMode, type Theme, type TokenName } from '../utils/types';

import Accordion from './accordion';
import { baseTokens } from './base-token-editor';
import ContrastCard from './contrast-card';

type ResultsAccordionDisplayProps = {
	appearance: 'information' | 'warning' | 'danger' | 'success';
	description: string;
	resultList: string[];
};

const STANDARD_RESULT_HEIGHT = 88;
const TRANSPARENT_RESULT_HEIGHT = 128;
const ACCORDION_MAX_HEIGHT = 500;

/**
 * Displays contrast check results in an accordion, with cards for
 * each result. Takes some appearance properties and a list of results to display
 */
const ResultsAccordion = ({
	appearance,
	description,
	resultList,
	baseThemeType,
	customTheme,
	rawTokensCustom,
	resultsBaseTheme,
	resultsCustom,
}: ResultsAccordionDisplayProps & {
	baseThemeType: ColorMode;
	customTheme: Theme;
	rawTokensCustom: typeof rawTokensLight;
	resultsBaseTheme: typeof lightResults;
	resultsCustom: typeof lightResults;
}) => {
	const [filterValue, setFilterValue] = useState<string>('');

	const filteredResultsList = useMemo(() => {
		return resultList.filter((pairing) => {
			const { foreground, middleLayer, background } = resultsCustom.fullResults[pairing];
			return (
				foreground.includes(filterValue) ||
				middleLayer?.includes(filterValue) ||
				background.includes(filterValue)
			);
		});
	}, [filterValue, resultList, resultsCustom.fullResults]);

	const PairingCard = ({ index, style }: { index: number; style: any }) => {
		const pairing = filteredResultsList[index];
		const { foreground, middleLayer, background } = resultsBaseTheme.fullResults[pairing];
		return (
			<ContrastCard
				key={pairing}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				foregroundName={foreground as TokenName}
				middleLayerName={middleLayer as TokenName}
				backgroundName={background as TokenName}
				foregroundValue={
					rawTokensCustom.find((token) => token.cleanName === foreground)?.value as string
				}
				middleLayerValue={
					rawTokensCustom.find((token) => token.cleanName === middleLayer)?.value as string
				}
				backgroundValue={
					rawTokensCustom.find((token) => token.cleanName === background)?.value as string
				}
				contrastBase={resultsBaseTheme.fullResults[pairing].contrast.toPrecision(4)}
				baseThemeType={baseThemeType}
				contrastCustom={
					customTheme.length
						? resultsCustom?.fullResults[pairing].contrast.toPrecision(4)
						: undefined
				}
			/>
		);
	};

	function getItemSize(index: number) {
		return resultsBaseTheme.fullResults[filteredResultsList[index]].middleLayer
			? TRANSPARENT_RESULT_HEIGHT
			: STANDARD_RESULT_HEIGHT;
	}
	return (
		<Accordion appearance={appearance} description={description} size={filteredResultsList.length}>
			<Stack space="space.100">
				<TextField
					aria-label="Filter results"
					elemBeforeInput={
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<Inline xcss={xcss({ paddingInline: 'space.100' })}>
							<SearchIcon label="" />
						</Inline>
					}
					value={filterValue}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
					onKeyPress={(e) => {
						// clear field on escape
						if (e.key === 'Escape') {
							setFilterValue('');
						}
					}}
				/>

				<List
					height={Math.min(
						TRANSPARENT_RESULT_HEIGHT * filteredResultsList.length,
						ACCORDION_MAX_HEIGHT,
					)}
					innerElementType="ul" // TODO is this the right semantics for a virtual list?
					itemCount={filteredResultsList.length}
					itemSize={getItemSize}
					width="100%"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ overflowX: 'hidden' }}
					overscanCount={2}
				>
					{PairingCard}
				</List>
			</Stack>
		</Accordion>
	);
};

export function getCustomTheme(
	customTheme: Theme,
	customBaseTokens: typeof baseTokens,
	baseThemeType: ColorMode,
) {
	const baseRawTokens = fg('platform-component-visual-refresh')
		? baseThemeType === 'light'
			? rawTokensBrandRefreshLight
			: rawTokensBrandRefreshDark
		: baseThemeType === 'light'
			? rawTokensLight
			: rawTokensDark;
	const rawTokens: typeof rawTokensLight = JSON.parse(JSON.stringify(baseRawTokens));
	rawTokens.forEach((token) => {
		// set metadata based on custom theme value (base token or raw hex)
		const index = customTheme.findIndex((t) => t?.name === token?.cleanName);
		if (index !== -1) {
			// If a base token has been chosen, update metadata
			if (Object.keys(baseTokens).includes(customTheme[index].value)) {
				token.original.value = customTheme[index].value;
				token.value = baseTokens[customTheme[index].value as string];
			} else {
				token.value = customTheme[index].value;
			}
		}
		// Update value if the chosen base token has been customized
		if (token.attributes.group === 'paint') {
			const baseTokenValue = customBaseTokens[token?.original?.value as string];
			if (baseTokenValue) {
				token.value = baseTokenValue;
			}
		}
	});
	return rawTokens;
}

/**
 * A contrast checker, and results display.
 * Takes a custom theme and custom base tokens, and checks each pair of tokens for expected contrast, using
 * the list of generated pairs generated at build time.
 * Results are displayed in groups, with basic filtering options and an option to download as CSV.
 */
const Results = ({
	customTheme,
	customBaseTokens,
	baseThemeType,
}: {
	customTheme: Theme;
	customBaseTokens: typeof baseTokens;
	baseThemeType: ColorMode;
}) => {
	const [includeTransparencies, setIncludeTransparencies] = useState<boolean>(false);
	const [includeInteractions, setIncludeInteractions] = useState<boolean>(true);
	const [useAAA, setUseAAA] = useState<boolean>(false);

	const resultsBaseMap = {
		light: { AAA: lightResultsAAA, AA: lightResults },
		dark: { AAA: darkResultsAAA, AA: darkResults },
	};
	let resultsBaseTheme = resultsBaseMap[baseThemeType][useAAA ? 'AAA' : 'AA'];

	// Generate custom theme from input
	const rawTokensCustom = useMemo(
		() => getCustomTheme(customTheme, customBaseTokens, baseThemeType),
		[customTheme, customBaseTokens, baseThemeType],
	);

	// Generate results (should be debounced)
	const resultsCustom = useMemo(() => {
		var results: typeof lightResults | undefined;
		try {
			results = checkThemePairContrasts(rawTokensCustom, 'custom', false, useAAA);
		} catch (e) {
			console.error(e);
		}
		return results;
	}, [rawTokensCustom, useAAA]);

	// Generate list of new violations in custom theme
	const betterContrast: string[] = [];
	const worseContrast: string[] = [];
	const newViolations: string[] = [];
	const solvedViolations: string[] = [];
	const bothViolations: string[] = [];
	const bothPassing: string[] = [];

	if (resultsCustom && resultsCustom.fullResults) {
		Object.keys(resultsCustom.fullResults).forEach((combination) => {
			if (
				(!includeTransparencies &&
					resultsBaseTheme.fullResults[combination]?.middleLayer !== undefined) ||
				!resultsBaseTheme.fullResults[combination] ||
				(!includeInteractions && resultsBaseTheme.fullResults[combination].isInteraction)
			) {
				return;
			}
			const combinationBase = resultsBaseTheme.fullResults[combination];
			const combinationCustom = (resultsCustom as typeof resultsBaseTheme).fullResults[combination];
			if (combinationCustom.contrast > combinationBase.contrast) {
				betterContrast.push(combination);
			}
			if (combinationCustom.contrast < combinationBase.contrast) {
				worseContrast.push(combination);
			}
			if (
				combinationBase.meetsRequiredContrast === 'FAIL' &&
				combinationCustom.meetsRequiredContrast === 'PASS'
			) {
				solvedViolations.push(combination);
			}
			if (
				combinationBase.meetsRequiredContrast === 'PASS' &&
				combinationCustom.meetsRequiredContrast === 'FAIL'
			) {
				newViolations.push(combination);
			}
			if (
				combinationBase.meetsRequiredContrast === 'FAIL' &&
				combinationCustom.meetsRequiredContrast === 'FAIL'
			) {
				bothViolations.push(combination);
			}
			if (
				combinationBase.meetsRequiredContrast === 'PASS' &&
				combinationCustom.meetsRequiredContrast === 'PASS'
			) {
				bothPassing.push(combination);
			}
		});
	}

	const ResultsAccordionData = ({
		appearance,
		description,
		resultList,
	}: ResultsAccordionDisplayProps) => {
		return (
			<ResultsAccordion
				appearance={appearance}
				description={description}
				resultList={resultList}
				baseThemeType={baseThemeType}
				customTheme={customTheme}
				rawTokensCustom={rawTokensCustom}
				resultsBaseTheme={resultsBaseTheme}
				resultsCustom={resultsCustom as typeof resultsBaseTheme}
			></ResultsAccordion>
		);
	};

	return (
		<Stack space="space.200">
			<Inline spread="space-between">
				<Heading size="xlarge">Results:</Heading>
				<Button
					onClick={() => {
						const fullCustomResults =
							customTheme.length > 0
								? checkThemePairContrasts(rawTokensCustom, 'custom', true, useAAA)
								: undefined;
						downloadResultsAsCSV(fullCustomResults?.fullResults);
					}}
				>
					Download CSV
				</Button>
			</Inline>
			<p>
				Checking WCAG 2.1 contrast for "recommended pairings" of tokens, automatically generated by
				the <code>typescript-token-pairings</code> formatter.
			</p>
			<SectionMessage appearance="discovery" title="This tool is in beta">
				Some pairs of tokens listed below may not require the listed contrast, and some valid
				pairings may be missing.
			</SectionMessage>
			<Inline shouldWrap={true} space="space.200">
				<Checkbox
					value="include_interactions"
					label="Include interaction tokens"
					isChecked={includeInteractions}
					onChange={(e) => setIncludeInteractions(e.target.checked)}
					name="include_interactions"
				/>
				<Checkbox
					value="include_transparencies"
					label="Include transparent tokens"
					isChecked={includeTransparencies}
					onChange={(e) => setIncludeTransparencies(e.target.checked)}
					name="include_transparencies"
				/>
				<Checkbox
					value="AAA"
					label="Use AAA contrast thresholds"
					isChecked={useAAA}
					onChange={(e) => setUseAAA(e.target.checked)}
					name="include_transparencies"
				/>
			</Inline>
			{resultsCustom ? (
				<Fragment>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<Box xcss={xcss({ overflow: 'auto', height: '100%' })}>
						<Stack space="space.200">
							{(customTheme.length > 0 || Object.keys(customBaseTokens).length > 0) && (
								<Fragment>
									<ResultsAccordionData
										appearance="danger"
										description="Pairings that now breach:"
										resultList={newViolations}
									/>
									<ResultsAccordionData
										appearance="success"
										description="Pairings that no longer breach:"
										resultList={solvedViolations}
									/>
									<ResultsAccordionData
										appearance="success"
										description="Pairings with better contrast:"
										resultList={betterContrast}
									/>
									<ResultsAccordionData
										appearance="warning"
										description="Pairings with worse contrast:"
										resultList={worseContrast}
									/>
								</Fragment>
							)}
							<ResultsAccordionData
								appearance="warning"
								description={customTheme.length > 0 ? 'Failing in both' : 'Failing contrast'}
								resultList={bothViolations}
							/>
							<ResultsAccordionData
								appearance="success"
								description={customTheme.length > 0 ? 'Passing in both' : 'Passing contrast'}
								resultList={bothPassing}
							/>
						</Stack>
					</Box>
				</Fragment>
			) : (
				<SectionMessage appearance="warning" title="Invalid theme provided">
					Check the syntax of your custom theme
				</SectionMessage>
			)}
		</Stack>
	);
};

export default Results;
