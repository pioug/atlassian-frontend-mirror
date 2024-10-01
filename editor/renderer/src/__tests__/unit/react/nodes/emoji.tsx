import React from 'react';
import { mount } from 'enzyme';

import RendererEmoji from '../../../../react/nodes/emoji';

describe('Emoji', () => {
	it('should render Emoji UI component', () => {
		const component = mount(<RendererEmoji shortName="shortname" id="id" text="fallback" />);
		expect(component.find(RendererEmoji)).toHaveLength(1);
		component.unmount();
	});

	it('should convert text to fallback attribute', () => {
		const component = mount(<RendererEmoji shortName="shortname" id="id" text="fallback" />);

		expect(component.find(RendererEmoji).prop('text')).toEqual('fallback');
		component.unmount();
	});
});
