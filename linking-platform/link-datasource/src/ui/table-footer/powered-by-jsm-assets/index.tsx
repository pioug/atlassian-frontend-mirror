import React from 'react';

import { cssMap } from '@compiled/react';

import { AssetsIcon } from '@atlaskit/logo';
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

export const PoweredByJSMAssets = (props: { text: string }): React.JSX.Element => {
	const ASSETS_APP_LINK = '/jira/assets';
	const { fireEvent } = useDatasourceAnalyticsEvents();

	return (
		<Box xcss={styles.jsmContainerStyles} padding="space.150">
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
			<a
				data-testid={'powered-by-jsm-assets-link'}
				onClick={() =>
					fireEvent('ui.link.clicked.poweredBy', {
						componentHierarchy: 'datasourceTable',
						extensionKey: 'jsm-cmdb-gateway',
					})
				}
				href={ASSETS_APP_LINK}
				rel="noreferrer"
				target="_blank"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'center',
				}}
			>
				<AssetsIcon
					size="small"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
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
