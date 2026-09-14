import React from 'react';

import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl';

import type { Formatter } from './i18n';

type FormatterFactory = (messageDescriptor: MessageDescriptor) => Formatter;

export const propFormatter: FormatterFactory =
	(messageDescriptor: MessageDescriptor) =>
	({
		values,
		children,
	}: {
		children?(props: string): React.ReactElement;
		values?: { [k: string]: string };
	}) => {
		const { formatMessage } = useIntl();
		const message = formatMessage(messageDescriptor, values);
		if (typeof children === 'function') {
			return children(message);
		}
		return <FormattedMessage values={values} {...messageDescriptor} />;
	};
