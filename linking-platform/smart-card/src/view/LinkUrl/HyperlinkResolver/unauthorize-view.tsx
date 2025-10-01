import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import type { LinkProvider } from '@atlaskit/link-extractors';

import { messages } from '../../../messages';
import { ActionButton } from '../../InlineCard/common/action-button';
import Hyperlink from '../Hyperlink';
import type { LinkUrlProps } from '../types';

type HyperlinkUnauthorizedViewProps = LinkUrlProps & {
	onAuthorize?: () => void;
	provider?: LinkProvider;
	showConnectBtn?: boolean;
};
const HyperlinkUnauthorizedView = ({
	onAuthorize,
	provider,
	showConnectBtn,
	...props
}: HyperlinkUnauthorizedViewProps) => {
	return (
		<>
			<Hyperlink {...props} />
			{showConnectBtn && (
				<>
					{' '}
					<ActionButton onClick={onAuthorize} testId="button-connect-account">
						<FormattedMessage
							{...messages.connect_link_account_card_name}
							values={{ context: provider?.text }}
						/>
					</ActionButton>
				</>
			)}
		</>
	);
};
export default HyperlinkUnauthorizedView;
