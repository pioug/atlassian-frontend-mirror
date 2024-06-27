import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test ensure-valid-emotion-css-prop', () => {
	tester.run('ensure-valid-emotion-css-prop', rule, {
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
			{
				code: `
				/** @jsx jsx */
			  import { jsx } from '@emotion/react';
				const styles = { opacity: 0.5 };
			  const Component = () => <div css={styles} />;`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
				const getOpacity = (foo) => 0.5;
			  const Component = (props) => {
					const styles = { opacity: getOpacity(props.foo) };
					return <div css={styles} />
				};`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
				const getStyles = (opacity) => ({ color: 'red', opacity });
			  const Component = (props) => <div css={getStyles(props.opacity)} />`,
				filename: 'src/index.tsx',
			},
			{
				code: `
				/** @jsx jsx */
			  import { jsx, css } from '@emotion/react';
				const getOpacity = (foo) => 0.5;
				function getStyles(props) {
					return { color: 'red', opacity: props.opacity };
				}
			  const Component = (props) => <div css={getStyles(props)} />;`,
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
			{
				code: `
				/** @jsx jsx */
				import { jsx, css } from '@emotion/react';
				const getOpacity = (foo) => 0.5;
				const Component = (props) => <div css={{ opacity: getOpacity(props.foo) }} />;`,
				filename: 'src/index.tsx',
				errors: [{ messageId: 'noEmotionCssPropFunctionCall' }],
			},
			{
				code: `
				/** @jsx jsx */
				import { jsx, css } from '@emotion/react';
				function getOpacity(foo) {
					return 0.5;
				}
				const Component = (props) => <div css={{ opacity: getOpacity(props.foo) }} />;`,
				filename: 'src/index.tsx',
				errors: [{ messageId: 'noEmotionCssPropFunctionCall' }],
			},
		],
	});
});
