import React from 'react';
import {
	IntlProvider,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import { getMessagesForLocale, type LangCode } from '../util/i18n-util';

export interface Props {
	children: React.ReactChild;
}

class MessagesIntlProvider extends React.Component<Props & WrappedComponentProps> {
	render() {
		const { intl, children } = this.props;

		return (
			<IntlProvider
				messages={getMessagesForLocale(intl.locale as LangCode)}
				locale={intl.locale}
				defaultLocale="en-US"
			>
				{children}
			</IntlProvider>
		);
	}
}

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MessagesIntlProvider);
export default _default_1;
