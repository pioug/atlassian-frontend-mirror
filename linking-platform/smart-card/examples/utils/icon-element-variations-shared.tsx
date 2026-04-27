/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { IconType, SmartLinkSize } from '../../src/constants';
import BaseIconElement from '../../src/view/FlexibleCard/components/elements/common/base-icon-element';

export const ALL = 'all' as const;

export type SizeOption = SmartLinkSize | typeof ALL;
export type TileOption = 'on' | 'off' | typeof ALL;

export const sizes: SmartLinkSize[] = [
	SmartLinkSize.Small,
	SmartLinkSize.Medium,
	SmartLinkSize.Large,
	SmartLinkSize.XLarge,
];

export const iconTypeGroups: { icons: IconType[]; title: string }[] = [
	{
		title: 'IconTile wrapped - @atlaskit/icon/core',
		icons: [
			IconType.Generic,
			IconType.Document,
			IconType.Audio,
			IconType.Code,
			IconType.File,
			IconType.Folder,
			IconType.Image,
			IconType.Presentation,
			IconType.Spreadsheet,
			IconType.Video,
		],
	},
	{
		title: 'Basic - @atlaskit/icon/core',
		icons: [
			IconType.Default,
			IconType.Project,
			IconType.Template,
			IconType.Forbidden,
			IconType.Error,
		],
	},
	{
		title: 'Badge icons - @atlaskit/icon/core',
		icons: [
			IconType.Attachment,
			IconType.CheckItem,
			IconType.Component,
			IconType.Comment,
			IconType.View,
			IconType.React,
			IconType.Vote,
			IconType.PriorityUndefined,
			IconType.ProgrammingLanguage,
			IconType.Subscriber,
			IconType.SubTasksProgress,
		],
	},
	{
		title: 'File type icons (16/24) - @atlaskit/icon-file-type',
		icons: [
			IconType.Archive,
			IconType.Executable,
			IconType.GIF,
			IconType.GoogleDocs,
			IconType.GoogleForms,
			IconType.GoogleSheets,
			IconType.GoogleSlides,
			IconType.MSExcel,
			IconType.MSPowerpoint,
			IconType.MSWord,
			IconType.PDF,
			IconType.Sketch,
		],
	},
	{
		title: 'Object icons (16/24) - @atlaskit/icon-object',
		icons: [
			IconType.Blog,
			IconType.LiveDocument,
			IconType.Branch,
			IconType.Commit,
			IconType.PullRequest,
			IconType.Repo,
			IconType.Bug,
			IconType.Change,
			IconType.Epic,
			IconType.Incident,
			IconType.Problem,
			IconType.ServiceRequest,
			IconType.Story,
			IconType.SubTask,
			IconType.Task,
		],
	},
	{
		title: 'Product logos - @atlaskit/logo',
		icons: [IconType.Confluence, IconType.Jira],
	},

	{
		title: 'Priority icons - custom SVGs',
		icons: [
			IconType.PriorityBlocker,
			IconType.PriorityCritical,
			IconType.PriorityHigh,
			IconType.PriorityHighest,
			IconType.PriorityLow,
			IconType.PriorityLowest,
			IconType.PriorityMajor,
			IconType.PriorityMedium,
			IconType.PriorityMinor,
			IconType.PriorityTrivial,
		],
	},
];

export const iconTypeEntries: [string, IconType][] = iconTypeGroups.flatMap((group) =>
	group.icons.map<[string, IconType]>((icon: IconType) => [icon.toString(), icon]),
);

if (iconTypeEntries.length !== Object.keys(IconType).length) {
	throw new Error('Not all IconType was represented in iconTypeGroups');
}

export const providerIcons: Record<string, string[]> = {
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

export const IconGrid = ({
	children,
	gridTemplateColumns,
}: {
	children: React.ReactNode;
	gridTemplateColumns: string;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={gridStyles} style={{ gridTemplateColumns }}>
		{children}
	</div>
);

export interface IconVariantProps {
	activeSizes: SmartLinkSize[];
	icon?: IconType;
	label: string;
	render?: () => React.ReactNode;
	showBorder: boolean;
	showSizingOverlay: boolean;
	showTitle: boolean;
	tileVariants: boolean[];
	url?: string;
	zoom?: number;
}

const tooltipTableStyles = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr',
	columnGap: token('space.100'),
	font: token('font.body.small'),
	textAlign: 'left',
});

const tooltipHeadingStyles = css({
	gridColumn: '1 / -1',
});

const tooltipLabelStyles = css({
	whiteSpace: 'nowrap',
});

const tooltipDimStyles = css({
	fontFamily: 'monospace',
});

interface DomMeasurements {
	child: { height: number; tag: string; width: number } | null;
	wrapper: { height: number; tag: string; width: number };
}

function formatNumber(n: number): string {
	return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

function formatDimensions(m: { height: number; width: number }): string {
	return `${formatNumber(m.width)}×${formatNumber(m.height)}`;
}

function formatMeasurement(
	m: { height: number; width: number },
	zoomFactor: number,
): React.ReactNode {
	const raw = `${formatDimensions(m)} px`;
	if (zoomFactor <= 1) {
		return raw;
	}
	const adjusted = formatDimensions({
		height: m.height / zoomFactor,
		width: m.width / zoomFactor,
	});
	return (
		<React.Fragment>
			{adjusted} px <span css={tooltipLabelStyles}>(@ 100%)</span>
		</React.Fragment>
	);
}

function TooltipContent({
	label,
	icon,
	url,
	hasRender,
	size,
	isTiled,
	measurements,
	zoom = 100,
}: {
	hasRender?: boolean;
	icon?: IconType;
	isTiled: boolean;
	label: string;
	measurements: DomMeasurements | null;
	size: SmartLinkSize;
	url?: string;
	zoom?: number;
}) {
	let source: string;
	if (icon) {
		source = `icon: ${icon}`;
	} else if (url) {
		source = `url: ${url}`;
	} else if (hasRender) {
		source = 'render()';
	} else {
		source = 'default fallback';
	}

	const zoomFactor = zoom / 100;

	return (
		<div css={tooltipTableStyles}>
			<strong css={tooltipHeadingStyles}>{label}</strong>

			<span css={tooltipLabelStyles}>source</span>
			<span>{source}</span>

			<span css={tooltipLabelStyles}>size</span>
			<span>{size}</span>

			{isTiled && (
				<React.Fragment>
					<span css={tooltipLabelStyles}>tile</span>
					<span>'on'</span>
				</React.Fragment>
			)}

			{measurements && (
				<React.Fragment>
					<span css={tooltipLabelStyles}>{`<${measurements.wrapper.tag}>`}</span>
					<span css={tooltipDimStyles}>{formatMeasurement(measurements.wrapper, zoomFactor)}</span>

					{measurements.child && (
						<React.Fragment>
							<span css={tooltipLabelStyles}>{`└ <${measurements.child.tag}>`}</span>
							<span css={tooltipDimStyles}>
								{formatMeasurement(measurements.child, zoomFactor)}
							</span>
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</div>
	);
}

function IconInstance({
	label,
	icon,
	url,
	render,
	size,
	isTiled,
	showSizingOverlay,
	showTitle,
	zoom,
}: {
	icon?: IconType;
	isTiled: boolean;
	label: string;
	render?: () => React.ReactNode;
	showSizingOverlay: boolean;
	showTitle: boolean;
	size: SmartLinkSize;
	url?: string;
	zoom?: number;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [measurements, setMeasurements] = useState<DomMeasurements | null>(null);
	const testId = `icon-${label}-${size}-${isTiled}`;

	const measure = useCallback(() => {
		if (!containerRef.current) {
			return;
		}
		const tileEl = containerRef.current.querySelector<HTMLElement>(
			`[data-testid="${testId}-tile"]`,
		);
		const boxEl = containerRef.current.querySelector<HTMLElement>(`[data-testid="${testId}-box"]`);
		const wrapperEl = tileEl ?? boxEl;
		if (!wrapperEl) {
			return;
		}
		const wrapperRect = wrapperEl.getBoundingClientRect();
		const firstChild = wrapperEl.firstElementChild as HTMLElement | null;
		const childRect = firstChild?.getBoundingClientRect() ?? null;

		setMeasurements({
			wrapper: {
				width: wrapperRect.width,
				height: wrapperRect.height,
				tag: tileEl ? 'Tile' : 'Box',
			},
			child: childRect
				? {
						width: childRect.width,
						height: childRect.height,
						tag: firstChild!.tagName.toLowerCase(),
					}
				: null,
		});
	}, [testId]);

	return (
		<Stack alignInline="center" alignBlock="center" grow="fill" space="space.025">
			<Tooltip
				content={
					<TooltipContent
						label={label}
						icon={icon}
						url={url}
						hasRender={!!render}
						size={size}
						isTiled={isTiled}
						measurements={measurements}
						zoom={zoom}
					/>
				}
			>
				<div css={iconBoxStyles} ref={containerRef} onMouseOver={measure} onFocus={measure}>
					<BaseIconElement
						icon={icon}
						url={url}
						render={render}
						size={size}
						isTiledIcon={isTiled}
						testId={testId}
					/>
					{showSizingOverlay && (
						<React.Fragment>
							<div css={[sizesOverlayStyles, size20OverlayStyles]}></div>
							<div css={[sizesOverlayStyles, size24OverlayStyles]}></div>
							<div css={[sizesOverlayStyles, size32OverlayStyles]}></div>
						</React.Fragment>
					)}
				</div>
			</Tooltip>
			{showTitle && <div css={sizeTagStyles}>{size}</div>}
		</Stack>
	);
}

export const IconVariant = ({
	label,
	icon,
	url,
	render,
	activeSizes,
	tileVariants,
	showBorder,
	showSizingOverlay,
	showTitle,
	zoom,
}: IconVariantProps): JSX.Element => (
	<div css={[cellStyles, showBorder && !showSizingOverlay && cellBorderStyles]}>
		{showTitle && <div css={labelTextStyles}>{label}</div>}
		{tileVariants.map((isTiled) =>
			activeSizes.map((size) => (
				<IconInstance
					key={`${isTiled}-${size}`}
					label={label}
					icon={icon}
					url={url}
					render={render}
					size={size}
					isTiled={isTiled}
					showSizingOverlay={showSizingOverlay}
					showTitle={showTitle}
					zoom={zoom}
				/>
			)),
		)}
	</div>
);
