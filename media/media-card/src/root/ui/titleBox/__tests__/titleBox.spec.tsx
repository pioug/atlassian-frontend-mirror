import React from 'react';
import { shallow } from 'enzyme';
import { TitleBox } from '../titleBox';
import { FormattedDate } from '../formattedDate';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { Breakpoint } from '../../common';
import {
  TitleBoxWrapper,
  TitleBoxHeader,
  TitleBoxFooter,
  TitleBoxIcon,
} from '../styled';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';

describe('TitleBox', () => {
  it('should render TitleBox properly', () => {
    const name = 'roberto.jpg';
    const someTimestamp = Date.now();
    const component = shallow(
      <TitleBox
        name={name}
        createdAt={someTimestamp}
        breakpoint={Breakpoint.SMALL}
      />,
    );
    const wrapper = component.find(TitleBoxWrapper);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('breakpoint')).toBe(Breakpoint.SMALL);

    expect(component.find(TitleBoxHeader)).toHaveLength(1);
    const truncate = component.find(Truncate);
    expect(truncate).toHaveLength(1);
    expect(truncate.prop('text')).toBe(name);

    expect(component.find(TitleBoxFooter)).toHaveLength(1);
    expect(component.find(FormattedDate)).toHaveLength(1);
    expect(component.find(TitleBoxIcon)).toHaveLength(0);
  });

  it('should not render the footer if date is not provided', () => {
    const name = 'roberto.jpg';
    const component = shallow(
      <TitleBox name={name} breakpoint={Breakpoint.SMALL} />,
    );

    expect(component.find(TitleBoxHeader)).toHaveLength(1);
    const truncate = component.find(Truncate);
    expect(truncate).toHaveLength(1);
    expect(truncate.prop('text')).toBe(name);

    expect(component.find(TitleBoxFooter)).toHaveLength(0);
  });

  it('should render an icon if valid icon name is provided', () => {
    const name = 'roberto.jpg';
    const someTimestamp = Date.now();

    const component = shallow(
      <TitleBox
        name={name}
        breakpoint={Breakpoint.SMALL}
        createdAt={someTimestamp}
        titleBoxIcon="LockFilledIcon"
      />,
    );

    expect(component.find(TitleBoxIcon)).toHaveLength(1);
    expect(component.find(LockIcon)).toHaveLength(1);
  });
});
