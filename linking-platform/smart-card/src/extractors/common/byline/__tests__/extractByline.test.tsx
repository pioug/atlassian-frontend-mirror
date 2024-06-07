import { type JsonLd } from 'json-ld-types';
import { render, screen } from '@testing-library/react';

import { extractByline } from '../extractByline';
import { TEST_BASE_DATA, TEST_PERSON } from '../../__mocks__/jsonld';
import { withIntl } from '../../__mocks__/withIntl';

describe('extractors.byline', () => {
	it('returns undefined if neither created or updated present', () => {
		expect(extractByline(TEST_BASE_DATA)).toBe(undefined);
	});

	it('returns created at text if created present', async () => {
		const byline = extractByline({
			...TEST_BASE_DATA,
			'schema:dateCreated': new Date().toISOString(),
		} as JsonLd.Data.BaseData);
		expect(byline).toBeDefined();
		render(withIntl(byline));
		expect(await screen.findByText(/Created.*/)).toBeVisible();
	});

	it('returns created at text and createdBy if present', async () => {
		const byline = extractByline({
			...TEST_BASE_DATA,
			'schema:dateCreated': new Date().toISOString(),
			attributedTo: TEST_PERSON,
		} as JsonLd.Data.BaseData);
		expect(byline).toBeDefined();
		render(withIntl(byline));
		expect(await screen.findByText(/Created.*by.*my name/)).toBeVisible();
	});

	it('returns updated at text if created present', async () => {
		const byline = extractByline({
			...TEST_BASE_DATA,
			updated: new Date().toISOString(),
		} as JsonLd.Data.BaseData);
		expect(byline).toBeDefined();
		render(withIntl(byline));
		expect(await screen.findByText(/Updated.*/)).toBeVisible();
	});

	it('returns updated at text and updatedBy if present', async () => {
		const byline = extractByline({
			...TEST_BASE_DATA,
			updated: new Date().toISOString(),
			'atlassian:updatedBy': TEST_PERSON,
		} as JsonLd.Data.BaseData);
		expect(byline).toBeDefined();
		render(withIntl(byline));
		expect(await screen.findByText(/Updated.*by.*my name/)).toBeVisible();
	});
});
