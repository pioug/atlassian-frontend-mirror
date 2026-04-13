/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { Checkbox } from '@atlaskit/checkbox';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { RadioGroup as AtlaskitRadioGroup } from '@atlaskit/radio';
import Range from '@atlaskit/range';
import { token } from '@atlaskit/tokens';

import { IconType, SmartLinkSize } from '../src/constants';
import BaseIconElement from '../src/view/FlexibleCard/components/elements/common/base-icon-element';

import ExampleContainer from './utils/example-container';

const ALL = 'all' as const;

type SizeOption = SmartLinkSize | typeof ALL;
type TileOption = 'on' | 'off' | typeof ALL;

const sizes: SmartLinkSize[] = [
	SmartLinkSize.Small,
	SmartLinkSize.Medium,
	SmartLinkSize.Large,
	SmartLinkSize.XLarge,
];

const iconTypeEntries = Object.entries(IconType) as [string, IconType][];

const iconTypeGroups: { filter: (value: string) => boolean; title: string }[] = [
	{ filter: (v) => v.startsWith('FileType'), title: 'File Types' },
	{ filter: (v) => v.startsWith('BitBucket'), title: 'Bitbucket' },
	{ filter: (v) => v.startsWith('Jira'), title: 'Jira' },
	{
		filter: (v) => v.startsWith('Confluence') || v.startsWith('Provider:Confluence'),
		title: 'Confluence',
	},
	{ filter: (v) => v.startsWith('Provider'), title: 'Provider Icons' },
	{
		filter: (v) => v === 'Default' || v === 'Default:Error' || v === 'Default:Forbidden',
		title: 'Fallbacks',
	},
	{ filter: (v) => v.startsWith('Badge'), title: 'Badge Icons' },
];

const providerIcons: Record<string, string[]> = {
	'adobe-xd': [
		'https://xd.adobe.com/static/images/xd_favicon-b2ee7867cb9be9ee4055df64f32dcd58f3461fe3.ico',
	],
	airtable: ['https://airtable.com/images/favicon/baymax/android-chrome-192x192.png?v=2'],
	amplitude: ['https://static.amplitude.com/img/logos/amplitude_logo_48x48.png'],
	asana: ['https://asana.com/favicon.ico'],
	'azure-devops': ['https://cdn.vsassets.io/content/icons/favicon.ico'],
	box: ['https://app.box.com/favicon.ico'],
	canva: ['https://static.canva.com/static/images/favicon-1.ico'],
	clickup: ['https://clickup.com/blog/wp-content/uploads/2021/04/logo-gradient.png'],
	docusign: ['https://www.docusign.com/assets/images/favicon.ico'],
	dovetail: ['https://dovetail.com/images/logo-dark.svg'],
	dropbox: ['https://cfl.dropboxstatic.com/static/metaserver/static/images/favicon-vfl8lUR9B.ico'],
	figma: ['https://static.figma.com/app/icon/1/favicon.ico'],
	github: ['https://github.githubassets.com/favicon.ico'],
	gitlab: ['https://gitlab.com/favicon.ico'],
	'google-drive': [
		'https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-64dp/logo_drive_2020q4_color_2x_web_64dp.png',
	],
	hubspot: [
		'https://static.hsappstatic.net/StyleGuideUI/static-3.421/img/sprocket/apple-touch-icon.png',
	],
	launchdarkly: ['https://static.launchdarkly.com/app/s/img/favicon-osmo-prod.svg'],
	lovable: ['https://lovable.dev/icon.svg'],
	lucid: ['https://www.lucid.app/favicon.ico'],
	miro: ['https://miro.com/static/favicons/favicon.ico'],
	'ms-power-bi': ['https://app.powerbi.com/images/PowerBI_Favicon.ico'],
	'ms-teams': [
		'https://static2.sharepointonline.com/files/fabric-cdn-prod_20200430.002/assets/brand-icons/product/svg/teams_48x1.svg',
	],
	mural: ['https://app.mural.co/static/favicon-32x32.png'],
	notion: [
		'https://notion.so/front-static/favicon.ico',
		'https://www.notion.so/images/favicon.ico',
	],
	onedrive: ['https://onedrive.live.com/favicon.ico'],
	pagerduty: ['https://cdn.brandfolder.io/YX9ETPCP/at/266537g8kh6mmvt24jvsjb/P-GreenRGB.png'],
	pipedrive: ['https://cdn.us-east-1.pipedriveassets.com/webapp/images/icons/pipedrive_32x32.png'],
	replit: ['https://replit.com/public/icons/favicon-prompt-192.png'],
	salesforce: ['https://www.salesforce.com/etc/designs/sfdc-www/en_au/favicon.ico'],
	sentry: ['https://docs.sentry.io/_next/static/media/sentry-logo-dark.fc8e1eeb.svg'],
	slack: ['https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png'],
	smartsheet: ['https://www.smartsheet.com/sites/default/files/favicons/apple-touch-icon.png'],
	stripe: ['https://stripe.com/favicon.ico'],
	todoist: ['https://www.todoist.com/static/favicon.ico'],
	webex: ['https://web.webex.com/favicon.ico'],
	zeplin: ['https://files.readme.io/187e88f-small-zeplin.png'],
};

const cellStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: token('space.050'),
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	boxSizing: 'border-box',
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: '1px',
});

const cellBorderStyles = css({
	borderRadius: '3px',
	borderColor: token('color.border'),
	borderStyle: 'solid',
	borderWidth: '1px',
});

const gridStyles = css({
	display: 'grid',
	gap: token('space.100'),
});

const IconGrid = ({
	children,
	gridTemplateColumns,
}: {
	children: React.ReactNode;
	gridTemplateColumns: string;
}) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={gridStyles} style={{ gridTemplateColumns }}>
		{children}
	</div>
);

const controlBoxStyles = css({
	backgroundColor: token('color.background.input'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	borderRadius: '3px',
});

const sectionHeadingStyles = css({
	backgroundColor: token('color.background.neutral'),
	paddingBlock: token('space.050'),
	paddingInline: token('space.100'),
});

const labelTextStyles = css({
	fontSize: '11px',
	textAlign: 'center',
	wordBreak: 'break-all',
});

const sizeTagStyles = css({
	fontSize: '10px',
	color: token('color.text.subtlest'),
});

const iconBoxStyles = css({
	position: 'relative',
});

const sizesOverlayStyles = css({
	boxSizing: 'border-box',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	borderStyle: 'solid',
});

const size20OverlayStyles = css({
	width: '20px',
	height: '20px',
	borderWidth: '2px',
	borderColor: 'rgba(0, 204, 231, 0.3)',
});

const size24OverlayStyles = css({
	width: '24px',
	height: '24px',
	borderWidth: '2px',
	borderColor: 'rgba(216, 0, 231, 0.3)',
});

const size32OverlayStyles = css({
	width: '32px',
	height: '32px',
	borderWidth: '4px',
	borderColor: 'rgba(64, 26, 255, 0.13)',
});

function RadioGroup<T extends string>({
	name,
	options,
	value,
	onChange,
}: {
	name: string;
	onChange: (v: T) => void;
	options: { label: string; value: T }[];
	value: T;
}) {
	return (
		<Box>
			<AtlaskitRadioGroup
				options={options.map((opt) => ({
					name,
					value: opt.value,
					label: opt.label,
				}))}
				value={value}
				onChange={(event) => onChange(event.currentTarget.value as T)}
			/>
		</Box>
	);
}

const sizeOptions: { label: string; value: SizeOption }[] = [
	{ label: 'All', value: ALL },
	{ label: 'Small', value: SmartLinkSize.Small },
	{ label: 'Medium', value: SmartLinkSize.Medium },
	{ label: 'Large', value: SmartLinkSize.Large },
	{ label: 'XLarge', value: SmartLinkSize.XLarge },
];

const tileOptions: { label: string; value: TileOption }[] = [
	{ label: 'All', value: ALL },
	{ label: 'On', value: 'on' },
	{ label: 'Off', value: 'off' },
];

const titleOptions: { label: string; value: 'show' | 'hide' }[] = [
	{ label: 'Show', value: 'show' },
	{ label: 'Hide', value: 'hide' },
];

const withExperimentsOptions: { label: string; value: 'true' | 'false' }[] = [
	{ label: 'Yes', value: 'true' },
	{ label: 'No', value: 'false' },
];

const sizingOverlayOptions: { label: string; value: 'show' | 'hide' }[] = [
	{ label: 'Show', value: 'show' },
	{ label: 'Hide', value: 'hide' },
];

interface IconVariantProps {
	activeSizes: SmartLinkSize[];
	icon?: IconType;
	label: string;
	render?: () => React.ReactNode;
	showBorder: boolean;
	showSizingOverlay: boolean;
	showTitle: boolean;
	tileVariants: boolean[];
	url?: string;
}

const IconVariant = ({
	label,
	icon,
	url,
	render,
	activeSizes,
	tileVariants,
	showBorder,
	showSizingOverlay,
	showTitle,
}: IconVariantProps) => (
	<div css={[cellStyles, showBorder && !showSizingOverlay && cellBorderStyles]}>
		{showTitle && <div css={labelTextStyles}>{label}</div>}
		{activeSizes.map((size) =>
			tileVariants.map((isTiled) => (
				<Stack
					key={`${size}-${isTiled}`}
					alignInline="center"
					alignBlock="center"
					grow="fill"
					space="space.025"
				>
					<div css={iconBoxStyles}>
						<BaseIconElement
							icon={icon}
							url={url}
							render={render}
							size={size}
							isTiledIcon={isTiled}
							testId={`icon-${label}-${size}-${isTiled}`}
						/>
						{showSizingOverlay && (
							<>
								<div css={[sizesOverlayStyles, size20OverlayStyles]}></div>
								<div css={[sizesOverlayStyles, size24OverlayStyles]}></div>
								<div css={[sizesOverlayStyles, size32OverlayStyles]}></div>
							</>
						)}
					</div>
					{showTitle && <div css={sizeTagStyles}>{size}</div>}
				</Stack>
			)),
		)}
	</div>
);

function useLocalStorageState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
	const storageKey = `example-31-icon-variations-${key}`;
	const [state, setState] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
		} catch {
			return defaultValue;
		}
	});

	const setPersistedState = useCallback(
		(value: T) => {
			setState(value);
			try {
				localStorage.setItem(storageKey, JSON.stringify(value));
			} catch {
				// storage full or unavailable
			}
		},
		[storageKey],
	);

	return [state, setPersistedState];
}

export default (): React.JSX.Element => {
	const [sizeOption, setSizeOption] = useLocalStorageState<SizeOption>(
		'size',
		SmartLinkSize.Medium,
	);
	const [tileOption, setTileOption] = useLocalStorageState<TileOption>('tile', 'off');
	const [titleOption, setTitleOption] = useLocalStorageState<'show' | 'hide'>('title', 'hide');
	const [gridMinWidth, setGridMinWidth] = useLocalStorageState<number>('gridMinWidth', 40);
	const [withExperimentsOption, setWithExperimentsOption] = useLocalStorageState<string>(
		'withExperiments',
		'true',
	);
	const [groupByDomain, setGroupByDomain] = useLocalStorageState<boolean>('groupByDomain', true);
	const [sizingOverlayOption, setSizingOverlayOption] = useLocalStorageState<'show' | 'hide'>(
		'sizingOverlay',
		'hide',
	);

	const showTitle = titleOption === 'show';
	const showBorder = tileOption === 'off';
	const showSizingOverlay = sizingOverlayOption === 'show';
	const gridTemplateColumns = `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`;

	const activeSizes = useMemo(() => (sizeOption === ALL ? sizes : [sizeOption]), [sizeOption]);

	const tileVariants = useMemo(
		() => (tileOption === ALL ? [false, true] : [tileOption === 'on']),
		[tileOption],
	);

	return (
		<ExampleContainer
			title="IconElement — All Variations"
			maxWidth="1200px"
			withExperiments={withExperimentsOption === 'true'}
		>
			<Stack space="space.200">
				{/* Controls */}
				<div css={controlBoxStyles}>
					<Stack space="space.150">
						<Inline space="space.300">
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">Size:</Text>
								<RadioGroup
									name="size"
									options={sizeOptions}
									value={sizeOption}
									onChange={setSizeOption}
								/>
							</Inline>
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">Tile:</Text>
								<RadioGroup
									name="tile"
									options={tileOptions}
									value={tileOption}
									onChange={setTileOption}
								/>
							</Inline>
							<Stack space="space.200">
								<Inline space="space.200" alignBlock="start">
									<Text weight="bold">Text:</Text>
									<RadioGroup
										name="title"
										options={titleOptions}
										value={titleOption}
										onChange={setTitleOption}
									/>
								</Inline>
								<Inline space="space.200" alignBlock="start">
									<Text weight="bold">
										Sizing
										<br />
										overlay:
									</Text>
									<RadioGroup
										name="sizing-overlay"
										options={sizingOverlayOptions}
										value={sizingOverlayOption}
										onChange={setSizingOverlayOption}
									/>
								</Inline>
							</Stack>
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">With experiments:</Text>
								<RadioGroup
									name="with-experiments"
									options={withExperimentsOptions}
									value={withExperimentsOption}
									onChange={setWithExperimentsOption}
								/>
							</Inline>
						</Inline>
						<Inline space="space.200" alignBlock="start" grow="fill">
							<Text weight="bold" color="color.text">
								Grid cell: {gridMinWidth}px
							</Text>
							<Box>
								<Range
									aria-label="Grid cell min width"
									step={10}
									min={30}
									max={300}
									value={gridMinWidth}
									onChange={setGridMinWidth}
								/>
							</Box>
						</Inline>
					</Stack>
				</div>

				{/* Section: IconType enum (icon prop) */}
				<div css={sectionHeadingStyles}>
					<Inline spread="space-between" alignBlock="center">
						<Text size="large" weight="bold">
							icon prop — IconType enum ({iconTypeEntries.length} values)
						</Text>
						<Checkbox
							label="Group by domain"
							isChecked={groupByDomain}
							onChange={(e) => setGroupByDomain(e.currentTarget.checked)}
						/>
					</Inline>
				</div>

				{groupByDomain ? (
					iconTypeGroups.map((group) => (
						<Stack key={group.title} space="space.100">
							<Text weight="bold">{group.title}</Text>
							<IconGrid gridTemplateColumns={gridTemplateColumns}>
								{iconTypeEntries
									.filter(([, v]) => group.filter(v))
									.map(([name, value]) => (
										<IconVariant
											key={name}
											label={name}
											icon={value}
											activeSizes={activeSizes}
											showBorder={showBorder}
											showSizingOverlay={showSizingOverlay}
											showTitle={showTitle}
											tileVariants={tileVariants}
										/>
									))}
							</IconGrid>
						</Stack>
					))
				) : (
					<IconGrid gridTemplateColumns={gridTemplateColumns}>
						{iconTypeEntries.map(([name, value]) => (
							<IconVariant
								key={name}
								label={name}
								icon={value}
								activeSizes={activeSizes}
								showBorder={showBorder}
								showSizingOverlay={showSizingOverlay}
								showTitle={showTitle}
								tileVariants={tileVariants}
							/>
						))}
					</IconGrid>
				)}

				{/* Section: URL-based icons (url prop) */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						url prop — 3P Provider favicons ({Object.keys(providerIcons).length} providers)
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					{Object.entries(providerIcons).map(([provider, urls]) =>
						urls.map((url, i) => (
							<IconVariant
								key={`${provider}-${i}`}
								label={urls.length > 1 ? `${provider} (${i + 1})` : provider}
								url={url}
								activeSizes={activeSizes}
								showBorder={showBorder}
								showSizingOverlay={showSizingOverlay}
								showTitle={showTitle}
								tileVariants={tileVariants}
							/>
						)),
					)}
				</IconGrid>

				{/* Section: render prop */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						render prop — Custom render functions
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					<IconVariant
						label="Emoji render"
						render={() => (
							<span role="img" aria-label="rocket">
								🚀
							</span>
						)}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="Text render"
						render={() => <span>AB</span>}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="SVG render"
						render={() => (
							<svg viewBox="0 0 16 16" width="16" height="16">
								<circle cx="8" cy="8" r="7" fill={token('color.icon.brand')} />
							</svg>
						)}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
				</IconGrid>

				{/* Section: default fallback (no props) */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						Default fallback — No icon/url/render provided
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					<IconVariant
						label="(default LinkIcon)"
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
				</IconGrid>
			</Stack>
		</ExampleContainer>
	);
};
