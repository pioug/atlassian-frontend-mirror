import React, { useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';

import type { LinkProvider } from '@atlaskit/link-extractors';

import { messages } from '../../../messages';
import { ActionButton } from '../../InlineCard/common/action-button';
import Hyperlink from '../Hyperlink';
import type { LinkUrlProps } from '../types';

type HyperlinkUnauthorizedViewProps = LinkUrlProps & {
	onAuthorize?: () => void;
	provider?: LinkProvider;
};
const HyperlinkUnauthorizedView = ({
	onAuthorize,
	provider,
	...props
}: HyperlinkUnauthorizedViewProps) => {
	const actionButton = useMemo(
		() =>
			onAuthorize ? (
				<ActionButton onClick={onAuthorize} testId="button-connect-account">
					<FormattedMessage
						{...messages.connect_link_account_card_name}
						values={{ context: provider?.text }}
					/>
				</ActionButton>
			) : null,
		[onAuthorize, provider?.text],
	);

	return (
		<>
			<Hyperlink {...props} />
			{actionButton}
		</>
	);
};
export default HyperlinkUnauthorizedView;
