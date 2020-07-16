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
import { FailedTitleBox, ErrorMessage } from '../failedTitleBox';
import { Breakpoint } from '../../common';
import { TitleBoxWrapper, TitleBoxHeader } from '../styled';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { FormattedMessage } from 'react-intl';
import { NewExpRetryButton } from '../../../../files/cardImageView/cardOverlay/retryButton';
import { Truncate } from '../truncateText';

describe('FailedTitleBox', () => {
  it('should render FailedTitleBox properly', () => {
    const name = 'roberto.jpg';
    const component = shallow(
      <FailedTitleBox name={name} breakpoint={Breakpoint.SMALL} />,
    );
    const wrapper = component.find(TitleBoxWrapper);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);

    const header = component.find(TitleBoxHeader);
    const truncate = header.find(Truncate);
    expect(header.find(Truncate)).toHaveLength(1);
    expect(truncate).toHaveLength(1);
    expect(truncate.prop('text')).toBe(name);

    const footer = component.find(ErrorMessage);
    expect(footer).toHaveLength(1);
  });

  it('should render ErrorMessage properly', () => {
    const message = shallow(<ErrorMessage />);
    expect(getErrorMessage).toHaveBeenCalledTimes(1);
    expect(message.find(EditorWarningIcon)).toHaveLength(1);
    expect(message.find(FormattedMessage)).toHaveLength(1);
  });

  it('should display Retry Button when onRetry is passed', () => {
    const message = shallow(<ErrorMessage onRetry={() => {}} />);
    expect(message.find(NewExpRetryButton)).toHaveLength(1);
  });
});
