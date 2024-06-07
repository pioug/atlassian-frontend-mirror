import React from 'react';
import { render, screen } from '@testing-library/react';

import { extractAttachmentCount, type LinkAttachmentType } from '../extractAttachmentCount';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkAttachmentType;

describe('extractors.detail.AttachmentCount', () => {
	it('returns undefined when no attachment count present', () => {
		expect(extractAttachmentCount(BASE_DATA)).toBe(undefined);
	});

	it('returns number and icon when attachment count present', async () => {
		const detail = extractAttachmentCount({
			...BASE_DATA,
			'atlassian:attachmentCount': 12,
		});
		expect(detail).toBeDefined();
		expect(detail!.text).toBe('12');
		render(<>{detail!.icon}</>);
		const icon = await screen.findByRole('img');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-label', 'attachments');
	});
});
