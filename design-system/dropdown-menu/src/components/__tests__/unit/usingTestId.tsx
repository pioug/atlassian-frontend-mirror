import React from 'react';

import { render } from '@testing-library/react';

import DropdownMenu from '../../../index';

const testIdTrigger = 'testing--trigger';

describe('Test Id', () => {
  it('Dropdown trigger is accessible via data-testid with a "Button" trigger type', () => {
    const { getByTestId, rerender } = render(
      <DropdownMenu trigger="Trigger" triggerType="button" testId="testing" />,
    );

    expect(getByTestId(testIdTrigger)).toBeTruthy();

    rerender(<DropdownMenu trigger="Trigger" triggerType="button" />);

    expect(() => getByTestId(testIdTrigger)).toThrow();
  });
});
