import { getLinkAttrs } from '../../link';

describe('marks/link', () => {
	describe('#getLinkAttrs', () => {
		it('should accept special href #top', () => {
			const anchor = document.createElement('a');
			anchor.setAttribute('href', '#top');
			expect(getLinkAttrs('href')(anchor)).toStrictEqual({
				__confluenceMetadata: undefined,
				href: '#top',
			});
		});

		it('should not accept arbitrary href', () => {
			const anchor = document.createElement('a');
			anchor.setAttribute('href', '#rubbish');
			expect(getLinkAttrs('href')(anchor)).toStrictEqual({
				__confluenceMetadata: undefined,
				href: '',
			});
		});
	});
});
