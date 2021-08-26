jest.mock('../../../../utils/getErrorMessage', () => {
  const original = jest.requireActual('../../../../utils/getErrorMessage');
  return {
    ...original,
    getErrorMessage: jest.fn(original.getErrorMessage),
  };
});
import { getErrorMessage } from '../../../../utils/getErrorMessage';
import React from 'react';
import { shallow } from 'enzyme';
import { FailedTitleBox } from '../failedTitleBox';
import { Breakpoint } from '../../Breakpoint';
import { TitleBoxWrapper } from '../styled';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { FormattedMessage } from 'react-intl';

describe('FailedTitleBox', () => {
  it('should render FailedTitleBox properly', () => {
    const component = shallow(<FailedTitleBox breakpoint={Breakpoint.SMALL} />);
    const wrapper = component.find(TitleBoxWrapper);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);

    expect(getErrorMessage).toHaveBeenCalledTimes(1);
    expect(component.find(EditorWarningIcon)).toHaveLength(1);
    expect(component.find(FormattedMessage)).toHaveLength(1);
  });
});
