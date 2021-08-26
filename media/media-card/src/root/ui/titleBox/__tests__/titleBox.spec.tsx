jest.mock('@atlaskit/media-ui/formatDate');

import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { TitleBox, FormattedDate } from '../titleBox';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { Breakpoint } from '../../Breakpoint';
import {
  TitleBoxWrapper,
  TitleBoxHeader,
  TitleBoxFooter,
  TitleBoxIcon,
} from '../styled';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import {
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';

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

  it('should render a formatted date using LocalizationProvider', () => {
    const locale = 'en';
    const timestamp = 1621568300000;
    asMockFunction(formatDate).mockReturnValue('some-formatted-date');
    const component = mount(
      <IntlProvider locale={locale}>
        <FormattedDate timestamp={timestamp} />
      </IntlProvider>,
    );

    const formatted = component.find(FormattedDate);
    expect(formatted.text()).toEqual('some-formatted-date');

    expectFunctionToHaveBeenCalledWith(formatDate, [timestamp, locale]);
  });
});
