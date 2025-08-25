import { transformTextLinkCodeMarks } from '../../../transforms/text-link-code-transform';

import textLinkCodeAdf from './__fixtures__/text-link-code-adf.json';
import textValidMarksAdf from './__fixtures__/text-valid-marks-adf.json';

describe('transformTextLinkCodeMarks', () => {
	it('should remove code marks and preserve link marks on text node', () => {
		const { isTransformed, transformedAdf } = transformTextLinkCodeMarks(textLinkCodeAdf);
		expect(isTransformed).toEqual(true);
		expect(transformedAdf).toMatchSnapshot();
	});

	it('should not change text nodes with valid mark combinations', () => {
		const { isTransformed, transformedAdf } = transformTextLinkCodeMarks(textValidMarksAdf);
		expect(isTransformed).toEqual(false);
		expect(transformedAdf).toMatchSnapshot();
	});
});
