import React from 'react';

import { cssMap } from '@compiled/react';

import { JiraServiceManagementIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

const styles = cssMap({
	jsmTextStyles: {
		color: token('color.text.subtle'),
		marginLeft: token('space.075'),
		'&:hover': {
			color: token('color.link.pressed'),
		},
	},
	jsmContainerStyles: {
		display: 'flex',
		flexDirection: 'row-reverse',
	},
});

export const PoweredByJSMAssets = (props: { text: string }) => {
	const ASSETS_LINK = '/jira/servicedesk/assets';
	const ASSETS_APP_LINK = '/jira/assets';
	const { fireEvent } = useDatasourceAnalyticsEvents();

	return (
		<Box xcss={styles.jsmContainerStyles} padding="space.150">
			<a
				data-testid={'powered-by-jsm-assets-link'}
				onClick={() =>
					fireEvent('ui.link.clicked.poweredBy', {
						componentHierarchy: 'datasourceTable',
						extensionKey: 'jsm-cmdb-gateway',
					})
				}
				href={fg('assets_as_an_app_v2') ? ASSETS_APP_LINK : ASSETS_LINK}
				rel="noreferrer"
				target="_blank"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'center',
				}}
			>
				{fg('assets_as_an_app_v2') ? <AssetsIcon /> : <JiraServiceManagementIcon size="xsmall" appearance="brand" label={props.text} />}
				<Box
					xcss={styles.jsmTextStyles}
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ fontSize: 'small' }}
				>
					{props.text}
				</Box>
			</a>
		</Box>
	);
};

// TODO: JDW-5554 use the AssetsIcon from @atlaskit/temp-nav-app-icons once it becomes a public package
const AssetsIcon = () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<span style={{ display: 'flex' }} role="img" aria-label='Assets icon'>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 6C0 2.68629 2.68629 0 6 0H18C21.3137 0 24 2.68629 24 6V18C24 21.3137 21.3137 24 18 24H6C2.68629 24 0 21.3137 0 18V6Z" fill="#1868DB"/>
				<g clipPath="url(#clip0_2912_2)">
					<path fillRule="evenodd" clipRule="evenodd" d="M8.50003 11.5354C10.0832 11.338 11.338 10.0832 11.5355 8.5H13.75V6.75H11.3081C10.7889 5.46732 9.53138 4.5625 8.06253 4.5625C6.12953 4.5625 4.56253 6.1295 4.56253 8.0625C4.56253 9.53135 5.46735 10.7889 6.75003 11.3081L6.75003 13.75H8.50003V11.5354ZM8.06253 9.375C8.7874 9.375 9.37503 8.78737 9.37503 8.0625C9.37503 7.33763 8.7874 6.75 8.06253 6.75C7.33766 6.75 6.75003 7.33763 6.75003 8.0625C6.75003 8.78737 7.33766 9.375 8.06253 9.375Z" fill="white"/>
					<path d="M19 7.625C19 8.83312 18.0207 9.8125 16.8125 9.8125C15.6044 9.8125 14.625 8.83312 14.625 7.625C14.625 6.41688 15.6044 5.4375 16.8125 5.4375C18.0207 5.4375 19 6.41688 19 7.625Z" fill="white"/>
					<path d="M7.62503 19C8.83315 19 9.81253 18.0206 9.81253 16.8125C9.81253 15.6044 8.83315 14.625 7.62503 14.625C6.41691 14.625 5.43753 15.6044 5.43753 16.8125C5.43753 18.0206 6.41691 19 7.62503 19Z" fill="white"/>
					<path d="M16.8125 19C18.0207 19 19 18.0206 19 16.8125C19 15.6044 18.0207 14.625 16.8125 14.625C15.6044 14.625 14.625 15.6044 14.625 16.8125C14.625 18.0206 15.6044 19 16.8125 19Z" fill="white"/>
					<path d="M13.75 15.9375H10.6875V17.6875H13.75V15.9375Z" fill="white"/>
					<path d="M15.9375 10.6875V13.75H17.6875V10.6875H15.9375Z" fill="white"/>
				</g>
				<defs>
				<clipPath id="clip0_2912_2">
				<rect width="21" height="21" fill="white" transform="translate(1.5 1.5)"/>
				</clipPath>
				</defs>
			</svg>
	  </span>
	)
}
