import React from 'react';
import { shallow } from 'enzyme';
import { IconMessage } from '..';
import { IconMessageWrapper } from '../iconMessageWrapper';

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
