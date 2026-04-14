/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

export const iconTypeEntries = Object.entries(IconType) as [string, IconType][];

export const iconTypeGroups: { filter: (value: string) => boolean; title: string }[] = [
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
}) => (
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
}: IconVariantProps) => (
	<div css={[cellStyles, showBorder && !showSizingOverlay && cellBorderStyles]}>
		{showTitle && <div css={labelTextStyles}>{label}</div>}
		{tileVariants.map((isTiled) =>
			activeSizes.map((size) => (
				<Stack
					key={`${isTiled}-${size}`}
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
							<React.Fragment>
								<div css={[sizesOverlayStyles, size20OverlayStyles]}></div>
								<div css={[sizesOverlayStyles, size24OverlayStyles]}></div>
								<div css={[sizesOverlayStyles, size32OverlayStyles]}></div>
							</React.Fragment>
						)}
					</div>
					{showTitle && <div css={sizeTagStyles}>{size}</div>}
				</Stack>
			)),
		)}
	</div>
);
