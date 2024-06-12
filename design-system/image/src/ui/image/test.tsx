/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { setGlobalTheme } from '@atlaskit/tokens';

import Image from './index';

const testId = 'image';
const testSrc = 'test.jpg';
const testSrcDark = 'test-dark.jpg';
const altText = 'Test image';

describe('Image', () => {
	it('should be found by its testid', async () => {
		render(<Image alt={altText} testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('should be an img element', async () => {
		render(<Image alt={altText} testId={testId} />);

		expect(screen.getByTestId(testId)).toBeInstanceOf(HTMLImageElement);
	});

	it('should use the provided src', () => {
		render(<Image alt={altText} testId={testId} src={testSrc} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('src', testSrc);
	});

	it('should use src even when srcDark is provided if no theme is selected', () => {
		render(<Image testId={testId} alt={altText} src={testSrc} srcDark={testSrcDark} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('src', testSrc);
	});

	it('should use src even when srcDark is provided if theme is set to light', async () => {
		await setGlobalTheme({ colorMode: 'light' });

		render(<Image testId={testId} alt={altText} src={testSrc} srcDark={testSrcDark} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('src', testSrc);
	});

	it('should use srcDark when theme is set to dark', async () => {
		await setGlobalTheme({ colorMode: 'dark' });

		render(<Image alt={altText} testId={testId} src={testSrc} srcDark={testSrcDark} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('src', testSrcDark);
	});

	it('should use src when theme is set to dark but srcDark is not provided', async () => {
		await setGlobalTheme({ colorMode: 'dark' });

		render(<Image testId={testId} alt={altText} src={testSrc} />);

		expect(screen.getByTestId(testId)).toHaveAttribute('src', testSrc);
	});
});
