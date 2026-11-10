import React from 'react';

import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import LinkButton from '@atlaskit/button/link';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';

type Props = {
	helpUrl?: string;
	isInsertEnabled: boolean;
	onClose: () => void;
	onConfirmInsert: () => void;
	resultCount: number;
};

export const RegistryElementBrowserFooter = ({
	helpUrl,
	isInsertEnabled,
	onClose,
	onConfirmInsert,
	resultCount,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<Inline alignBlock="center" grow="fill" spread="space-between">
			<Inline alignBlock="center" space="space.100">
				<Text color="color.text.subtlest">
					{formatMessage(messages.elementBrowserResultsAvailable, { count: resultCount })}
				</Text>
				{helpUrl && (
					<LinkButton appearance="subtle" href={helpUrl} target="_blank">
						{formatMessage(messages.help)}
					</LinkButton>
				)}
			</Inline>
			<Inline space="space.100">
				<Button appearance="primary" isDisabled={!isInsertEnabled} onClick={onConfirmInsert}>
					{formatMessage(messages.insert)}
				</Button>
				<Button appearance="subtle" onClick={onClose}>
					{formatMessage(messages.close)}
				</Button>
			</Inline>
		</Inline>
	);
};
