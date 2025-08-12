import React, { useMemo } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { AssetsIcon, JiraServiceManagementIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../../assets-modal';
import { footerMessages } from '../messages';

const styles = cssMap({
	anchor: {
		color: token('color.text.subtlest'),
		textDecoration: 'none',
		'&:hover': {
			color: token('color.text.subtlest'),
			textDecoration: 'none',
		},
	},
});

export const ProviderLink = ({ datasourceId }: { datasourceId: string }) => {
	const intl = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const anchor = useMemo(() => {
		if (datasourceId === ASSETS_LIST_OF_LINKS_DATASOURCE_ID) {
			return fg('assets_as_an_app_v2')
				? {
						content: intl.formatMessage(footerMessages.poweredByAssets),
						extensionKey: 'jsm-cmdb-gateway',
						icon: <AssetsIcon size="xsmall" />,
						interactionName: 'atlas-link',
						url: '/jira/assets',
					}
				: {
						content: intl.formatMessage(footerMessages.powerByJSM),
						extensionKey: 'jsm-cmdb-gateway',
						icon: <JiraServiceManagementIcon appearance="neutral" size="small" />,
						interactionName: 'atlas-link',
						url: '/jira/servicedesk/assets',
					};
		}
	}, [datasourceId, intl]);

	return anchor ? (
		<Anchor
			href={anchor.url}
			interactionName={anchor.interactionName}
			onClick={() =>
				fireEvent('ui.link.clicked.poweredBy', {
					componentHierarchy: 'datasourceTable',
					extensionKey: anchor.extensionKey,
				})
			}
			rel="noopener noreferrer"
			target="_blank"
			testId="powered-by-jsm-assets-link"
			xcss={styles.anchor}
		>
			<Inline alignBlock="center" space="space.075">
				{anchor.icon}
				{anchor.content}
			</Inline>
		</Anchor>
	) : null;
};
