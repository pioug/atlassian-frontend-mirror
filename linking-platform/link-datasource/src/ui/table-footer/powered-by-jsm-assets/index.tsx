import React from 'react';

import { cssMap } from '@compiled/react';

import { JiraServiceManagementIcon } from '@atlaskit/logo';
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
