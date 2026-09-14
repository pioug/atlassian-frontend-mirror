import React from 'react';

import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import LinkButton from '@atlaskit/button/link';
import { Inline, Text } from '@atlaskit/primitives/compiled';

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
					{formatMessage(
						{
							defaultMessage:
								'{count, plural, one {# result available} other {# results available}}',
							id: 'editor.quick-insert.results-available',
						},
						{ count: resultCount },
					)}
				</Text>
				{helpUrl && (
					<LinkButton appearance="subtle" href={helpUrl} target="_blank">
						{formatMessage({ defaultMessage: 'Help', id: 'editor.quick-insert.help' })}
					</LinkButton>
				)}
			</Inline>
			<Inline space="space.100">
				<Button appearance="primary" isDisabled={!isInsertEnabled} onClick={onConfirmInsert}>
					{formatMessage({ defaultMessage: 'Insert', id: 'editor.quick-insert.insert' })}
				</Button>
				<Button appearance="subtle" onClick={onClose}>
					{formatMessage({ defaultMessage: 'Close', id: 'editor.quick-insert.close' })}
				</Button>
			</Inline>
		</Inline>
	);
};
