import React from 'react';

import { render } from '@testing-library/react';

import { MacroFallbackCard } from '../../src/ui';

import { macrosTestProps } from './props.mock';

describe('MacroFallbackCard', () => {
	it('should render macroName', () => {
		const { getByText } = render(<MacroFallbackCard {...macrosTestProps.default} />);
		expect(getByText(macrosTestProps.default.macroName)).toBeTruthy();
	});

	it('should show error message if exists', () => {
		const { getByText } = render(<MacroFallbackCard {...macrosTestProps.error} />);
		expect(getByText(macrosTestProps.error.errorMessage)).toBeTruthy();
	});

	it("shouldn't show error message while loading", () => {
		const { queryByText } = render(<MacroFallbackCard {...macrosTestProps.loadingError} />);
		expect(queryByText(macrosTestProps.loadingError.errorMessage)).toBeNull();
	});
});
