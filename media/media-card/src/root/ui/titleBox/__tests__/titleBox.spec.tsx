import React from 'react';
// eslint-disable-next-line no-restricted-imports
import dateFns from 'date-fns';
const originalFormat = dateFns.format;
dateFns.format = jest.fn((date: Date, format: string) =>
  originalFormat(date, format),
) as any;
import { shallow } from 'enzyme';
import { TitleBox, formatDate } from '../titleBox';
import { Truncate } from '../truncateText';
import { Breakpoint } from '../../common';
import { TitleBoxWrapper, TitleBoxHeader, TitleBoxFooter } from '../styled';

describe('TitleBox', () => {
  beforeEach(() => {
    (dateFns.format as jest.Mock).mockClear();
  });
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

    const header = component.find(TitleBoxHeader);
    const truncate = header.find(Truncate);
    expect(header.find(Truncate)).toHaveLength(1);
    expect(truncate).toHaveLength(1);
    expect(truncate.prop('text')).toBe(name);

    const footer = component.find(TitleBoxFooter);
    expect(footer).toHaveLength(1);
    expect(footer.prop('children')).toBe(formatDate(someTimestamp));
  });

  it('should format a timestamp as a date', () => {
    const someTimestamp = 1590634063223;
    formatDate(someTimestamp);
    expect(dateFns.format).toBeCalledTimes(1);
    expect(dateFns.format).toBeCalledWith(
      expect.any(Date),
      'DD MMM YYYY, hh:mm A',
    );
  });

  it('should not format an undefined timestamp', () => {
    expect(formatDate()).toBe('');
  });
});
