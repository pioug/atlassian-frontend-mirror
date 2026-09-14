import {
	SCROLLBAR_HARMONISATION_ATTRIBUTE,
	SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
} from '../../src/scrollbar-harmonisation/constants';
import { installScrollbarHarmonisation } from '../../src/scrollbar-harmonisation/install-scrollbar-harmonisation';
import { installScrollbarHarmonisationTransparentTrack } from '../../src/scrollbar-harmonisation/install-scrollbar-harmonisation-transparent-track';

afterEach(() => {
	document.documentElement.removeAttribute(SCROLLBAR_HARMONISATION_ATTRIBUTE);
	document.documentElement.removeAttribute(SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE);
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

	it('enables and cleans up transparent track styling', () => {
		const cleanup = installScrollbarHarmonisationTransparentTrack(document);

		expect(document.documentElement).toHaveAttribute(SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE);

		cleanup();

		expect(document.documentElement).not.toHaveAttribute(
			SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
		);
	});

	it('keeps transparent track styling enabled until every caller releases it', () => {
		const firstCleanup = installScrollbarHarmonisationTransparentTrack(document);
		const secondCleanup = installScrollbarHarmonisationTransparentTrack(document);

		firstCleanup();
		expect(document.documentElement).toHaveAttribute(SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE);

		secondCleanup();
		expect(document.documentElement).not.toHaveAttribute(
			SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
		);
	});
});
