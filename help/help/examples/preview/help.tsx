import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Help from '@atlaskit/help/Help';
import { ARTICLE_TYPE } from '@atlaskit/help/model/Help';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { getArticle } from '../utils/mockData';
const styles = cssMap({
	subject: {
		width: '340px',
		height: '240px',
		position: 'relative',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Help
					navigation={{
						navigationData: { articleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE }, history: [] },
						setNavigationData: () => {},
					}}
					helpArticle={{ onGetHelpArticle: async (id) => getArticle(id.id) }}
				>
					<Box padding="space.200">Invite your team from project settings.</Box>
				</Help>
			</Box>
		</IntlProvider>
	);
}
