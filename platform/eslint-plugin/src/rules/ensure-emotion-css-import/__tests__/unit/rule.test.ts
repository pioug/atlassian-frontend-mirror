import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test ensure-emotion-css-import', () => {
	tester.run('ensure-emotion-css-import', rule, {
		valid: [
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
				const styles = css({ opacity: 0.5 });
			  const Component = () => <div css={styles} />;`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
				const styles = css({ opacity: 0.5 });
			  const Component = () => <div css={[styles, { color: 'red' }]} />;`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div />;`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
			  const Component = () => <div css={css({ opacity: 0.5 })} />;`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div css={{ opacity: 0.5 }} />;`,
				filename: 'src/__tests__/test.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div css={{ opacity: 0.5 }} />;`,
				filename: 'src/examples/example.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div css={{ opacity: 0.5 }} />;`,
				filename: 'src/example-helpers/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div css={{ opacity: 0.5 }} />;`,
				filename: 'src/__fixtures__/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@compiled/react';
			  const Component = () => <div />;`,
				filename: 'src/index.tsx',
			},
		],
		invalid: [
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
			  const Component = () => <div css={{ opacity: 0.5 }} />;`,
				filename: 'src/index.tsx',
				errors: [{ messageId: 'noEmotionCssImport' }],
			},
		],
	});
});
