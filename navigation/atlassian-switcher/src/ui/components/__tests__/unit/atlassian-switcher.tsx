import React from 'react';
import { shallow } from 'enzyme';
import AtlassianSwitcher from '../../atlassian-switcher';

const mockNow = jest.fn();

jest.mock('../../../../common/utils/performance-now.ts', () => ({
  now: mockNow,
}));

beforeEach(() => {
  mockNow.mockReset().mockReturnValueOnce(0).mockReturnValue(250);
});

const noop = () => void 0;

describe('Atlassian Switcher', () => {
  it('basic snapshot', () => {
    const switcher = shallow(
      <AtlassianSwitcher
        product="jira"
        cloudId="CLOUD_ID"
        triggerXFlow={noop}
      />,
    );
    expect(switcher).toMatchSnapshot();
  });
});
