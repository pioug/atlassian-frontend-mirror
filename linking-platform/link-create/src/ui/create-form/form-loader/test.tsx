import React from 'react';

import { render } from '@testing-library/react';

import { CreateFormLoader } from './main';

describe('FormLoader', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<CreateFormLoader />);

		await expect(container).toBeAccessible();
	});

	it("should find the FormLoader by its testid when it's active", async () => {
		const testId = 'link-create-form-loader';

		const { getByTestId } = render(<CreateFormLoader />);

		expect(getByTestId(testId)).toBeTruthy();
	});
});
