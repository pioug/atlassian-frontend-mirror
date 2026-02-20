/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import Link from '@atlaskit/link';
import { Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';

const styles = cssMap({
	aiFooterWrapper: {
		paddingTop: token('space.050'),
	},
});

const AIFooter = () => (
	<Inline alignBlock="center" space="space.050" xcss={styles.aiFooterWrapper}>
		<InformationCircleIcon label="" color={token('color.text.subtle')} size="small" />
		<Text size="small">
			<Link
				href="https://www.atlassian.com/trust/atlassian-intelligence"
				appearance="subtle"
				target="_blank"
			>
				<FormattedMessage {...messages.ai_disclaimer} />
			</Link>
		</Text>
	</Inline>
);

export default AIFooter;
