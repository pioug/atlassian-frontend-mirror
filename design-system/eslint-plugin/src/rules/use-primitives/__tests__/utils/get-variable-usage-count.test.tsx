import { getVariableUsagesCount } from '../../utils/get-variable-usage-count';

describe('getVariableUsagesCount', () => {
	it('finds basic form', () => {
		const source = `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={paddingStyles}></div>
      `;

		const result = getVariableUsagesCount('paddingStyles', {
			// @ts-expect-error simplified object
			sourceCode: {
				text: source,
			},
		});

		expect(result).toEqual(1);
	});

	it('returns zero if only variable definition is found (for whatever reason)', () => {
		const source = `
      import { css } from '@emotion/react';
      const notUsedStyles = css({ padding: '8px' });
      <div></div>
      `;

		const result = getVariableUsagesCount('notUsedStyles', {
			// @ts-expect-error simplified object
			sourceCode: {
				text: source,
			},
		});

		expect(result).toEqual(0);
	});

	it('handles substrings correctly', () => {
		const source = `
      import { css } from '@emotion/react';
      const yourStyles = css({ padding: '8px' });
      const ourStyles = css({ padding: '8px' });
      <div css={ourStyles}></div>
      <div css={yourStyles}></div>
      `;

		const ourCount = getVariableUsagesCount('ourStyles', {
			// @ts-expect-error simplified object
			sourceCode: {
				text: source,
			},
		});
		expect(ourCount).toEqual(1);

		const yourCount = getVariableUsagesCount('yourStyles', {
			// @ts-expect-error simplified object
			sourceCode: {
				text: source,
			},
		});
		expect(yourCount).toEqual(1);
	});
});
