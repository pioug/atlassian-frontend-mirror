import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl-next';
import { IconMessage, CheckInternetConnection } from '..';
import { IconMessageWrapper } from '../iconMessageWrapper';
import { messages } from '@atlaskit/media-ui';

// Pre-create the message descriptor to avoid repeated object creation
const testMessageDescriptor = {
	id: 'test.creating_preview',
	defaultMessage: 'Creating preview...',
};

describe('iconMessage', () => {
	it('should be rendered properly', () => {
		const message = shallow(<IconMessage messageDescriptor={testMessageDescriptor} />);
		const wrapper = message.find(IconMessageWrapper);
		expect(wrapper).toHaveLength(1);
	});
});

describe('CheckInternetConnection', () => {
	it('should render correctly', () => {
		const component = shallow(
			<IntlProvider locale="en" messages={{ 'fabric.media.check_internet_connection': 'Failed to load. Please check your internet connection' }}>
				<CheckInternetConnection />
			</IntlProvider>,
		);
		expect(component.find(CheckInternetConnection)).toHaveLength(1);
	});

	it('should display the correct message from i18n', () => {
		const component = shallow(<CheckInternetConnection />);
		const iconMessage = component.find(IconMessage);
		expect(iconMessage.prop('messageDescriptor')).toBe(messages.check_internet_connection);
	});

	it('should pass through props correctly', () => {
		const component = shallow(<CheckInternetConnection />);
		const iconMessage = component.find(IconMessage);
		expect(iconMessage.exists()).toBe(true);
	});
});
