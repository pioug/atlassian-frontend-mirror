import React from 'react';
import { shallow } from 'enzyme';
import { FailedTitleBox } from '../failedTitleBox';
import { Breakpoint } from '../../common';
import { TitleBoxWrapper } from '../titleBoxComponents';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { FormattedMessage } from 'react-intl-next';

describe('FailedTitleBox', () => {
	it('should render FailedTitleBox properly', () => {
		const component = shallow(<FailedTitleBox breakpoint={Breakpoint.SMALL} />);
		const wrapper = component.find(TitleBoxWrapper);
		expect(wrapper).toHaveLength(1);
		expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);
		expect(component.find(EditorWarningIcon)).toHaveLength(1);
		expect(component.find(FormattedMessage)).toHaveLength(1);
	});
});
