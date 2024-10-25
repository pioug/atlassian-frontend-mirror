import React from 'react';

import { render, screen } from '@testing-library/react';

import { TEST_BASE_DATA } from '../../__mocks__/jsonld';
import {
	extractProgrammingLanguage,
	type LinkProgrammingLanguageType,
} from '../extractProgrammingLanguage';

const BASE_DATA = TEST_BASE_DATA as LinkProgrammingLanguageType;

describe('extractors.detail.programmingLanguage', () => {
	it('returns undefined when no programming language present', () => {
		expect(extractProgrammingLanguage(BASE_DATA)).toBe(undefined);
	});

	it('returns number and icon when programming language present', async () => {
		const detail = extractProgrammingLanguage({
			...BASE_DATA,
			'schema:programmingLanguage': 'JavaScript',
		});
		expect(detail).toBeDefined();
		expect(detail!.text).toBe('JavaScript');
		render(<>{detail!.icon}</>);
		const icon = await screen.findByRole('img');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-label', 'code');
	});
});
