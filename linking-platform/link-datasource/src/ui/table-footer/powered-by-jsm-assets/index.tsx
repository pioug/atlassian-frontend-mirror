import React from 'react';

import { JiraServiceManagementIcon } from '@atlaskit/logo';
import { Box, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';

const jsmTextStyles = xcss({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 'small',
	color: 'color.text.subtle',
	marginLeft: 'space.075',
	':hover': {
		color: 'color.link.pressed',
	},
});

const jsmContainerStyles = xcss({
	display: 'flex',
	flexDirection: 'row-reverse',
});

export const PoweredByJSMAssets = (props: { text: string }) => {
	const ASSETS_LINK = '/jira/servicedesk/assets';
	const { fireEvent } = useDatasourceAnalyticsEvents();

	return (
		<Box xcss={jsmContainerStyles} padding="space.150">
			<a
				data-testid={'powered-by-jsm-assets-link'}
				onClick={() =>
					fireEvent('ui.link.clicked.poweredBy', {
						componentHierarchy: 'datasourceTable',
						extensionKey: 'jsm-cmdb-gateway',
					})
				}
				href={ASSETS_LINK}
				rel="noreferrer"
				target="_blank"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'center',
				}}
			>
				<JiraServiceManagementIcon size="xsmall" appearance="brand" label={props.text} />
				<Box xcss={jsmTextStyles}>{props.text}</Box>
			</a>
		</Box>
	);
};
