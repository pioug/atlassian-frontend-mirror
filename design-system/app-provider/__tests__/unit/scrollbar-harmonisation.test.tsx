import { SCROLLBAR_HARMONISATION_ATTRIBUTE } from '../../src/scrollbar-harmonisation/constants';
import { installScrollbarHarmonisation } from '../../src/scrollbar-harmonisation/install-scrollbar-harmonisation';

afterEach(() => {
	document.documentElement.removeAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);
});

describe('scrollbar harmonisation', () => {
	it('enables and cleans up the document appearance', () => {
		const cleanup = installScrollbarHarmonisation(document);

		expect(document.documentElement).toHaveAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);

		cleanup();

		expect(document.documentElement).not.toHaveAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);
	});

	it('keeps the appearance enabled until every caller releases it', () => {
		const firstCleanup = installScrollbarHarmonisation(document);
		const secondCleanup = installScrollbarHarmonisation(document);

		firstCleanup();
		expect(document.documentElement).toHaveAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);

		secondCleanup();
		expect(document.documentElement).not.toHaveAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);
	});
});
