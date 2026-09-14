import { type IntlShape, type MessageDescriptor } from 'react-intl';

export const getFormattedMessageAsString = (
	intl: IntlShape,
	message: MessageDescriptor,
	context?: string,
): string => {
	const { formatMessage } = intl;
	return message ? formatMessage(message, { context }) : '';
};
