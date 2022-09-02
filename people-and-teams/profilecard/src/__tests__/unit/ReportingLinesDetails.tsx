import React from 'react';

import { shallow } from 'enzyme';

import ReportingLinesDetails, {
  ReportingLinesDetailsProps,
} from '../../components/User/ReportingLinesDetails';
import { ReportingLinesUser } from '../../types';

describe('ReportingLinesDetails', () => {
  const exampleReportingLineUser: ReportingLinesUser = {
    accountIdentifier: 'abcd',
    identifierType: 'ATLASSIAN_ID',
    pii: {
      name: 'name',
      picture: 'picture',
    },
  };
  const defaultProps: ReportingLinesDetailsProps = {
    reportingLines: {
      managers: [exampleReportingLineUser],
      reports: [exampleReportingLineUser, exampleReportingLineUser],
    },
    reportingLinesProfileUrl: 'profile-url',
    fireAnalyticsWithDuration: () => {},
  };

  const renderShallow = (props = {}) =>
    shallow(<ReportingLinesDetails {...defaultProps} {...props} />);

  it('should match snapshot when manager and reports are specified', () => {
    expect(
      renderShallow({ onReportingLinesClick: () => null }),
    ).toMatchSnapshot();
  });

  it('should match snapshot when manager and reports are NOT specified', () => {
    expect(renderShallow({ reportingLines: {} })).toMatchSnapshot();
  });
});
