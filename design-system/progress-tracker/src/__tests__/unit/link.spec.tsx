import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import ProgressTrackerLink from '../../internal/link';

const item = {
  id: 'visited-1',
  label: 'Visited Step',
  percentageComplete: 100,
  status: 'visited',
  href: '#',
  testId: 'test',
  onClick: jest.fn(),
} as const;

describe('@atlaskit/progress-tracker/link', () => {
  beforeEach(jest.resetAllMocks);
  afterEach(cleanup);

  it('sanity check', () => {
    const { getByTestId } = render(<ProgressTrackerLink {...item} />);
    expect(getByTestId(item.testId)).toBeDefined();
  });

  it('should render the component as per props', () => {
    const { getByText } = render(<ProgressTrackerLink {...item} />);
    const element = getByText(item.label);
    expect(element).toHaveStyleDeclaration('color', '#172B4D');
    expect(element.getAttribute('href')).toEqual(item.href);
  });

  it('clicking visited link should trigger onClick', () => {
    const { getByText } = render(<ProgressTrackerLink {...item} />);
    fireEvent.click(getByText(item.label));
    expect(item.onClick).toHaveBeenCalledTimes(1);
  });
});
