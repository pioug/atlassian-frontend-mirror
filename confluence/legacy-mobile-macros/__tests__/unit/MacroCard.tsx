import React from 'react';

import { render } from '@testing-library/react';

import { MacroCard } from '../../src/ui/MacroComponent/MacroCard';

import { macrosTestProps } from './props.mock';

describe('MacroCard', () => {
  it('should render macroName', () => {
    const { getByText } = render(<MacroCard {...macrosTestProps.default} />);
    expect(getByText(macrosTestProps.default.macroName)).toBeTruthy();
  });

  it('should show error message if exists', () => {
    const { getByText } = render(<MacroCard {...macrosTestProps.error} />);
    expect(getByText(macrosTestProps.error.errorMessage)).toBeTruthy();
  });

  it("shouldn't show error message while loading", () => {
    const { queryByText } = render(
      <MacroCard {...macrosTestProps.loadingError} />,
    );
    expect(queryByText(macrosTestProps.loadingError.errorMessage)).toBeNull();
  });
});
