import outdent from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'react/consistent-css-prop-usage',
	// @ts-expect-error
	rule,
	{
		valid: [],
		invalid: [
			// config for stylesPlacement: 'top' ⬇️
			{
				name: 'hoists cssMap function call below existing styles variable',
				code: outdent`<div css={isPrimary && {}} />`,
				output: outdent`
          import { css } from '@compiled/react';
          const styles = css({});
          <div css={isPrimary && styles} />
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists css object in ternary expression (first branch)',
				code: outdent`
          import { css } from '@compiled/react';
          const defaultStyles = css({
            padding: 8,
          });

          <div css={[isPrimary ? {} : defaultStyles]} />
        `,
				output: outdent`
          import { css } from '@compiled/react';
          const styles = css({});
          const defaultStyles = css({
            padding: 8,
          });

          <div css={[isPrimary ? styles : defaultStyles]} />
        `,

				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists css object in ternary expression (second branch)',
				code: outdent`
					import { css } from '@compiled/react';
					const containerStyles = css({
						padding: 8,
					});

					<div css={[isPrimary ? containerStyles : {}]} />
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const styles = css({});
					const containerStyles = css({
						padding: 8,
					});

					<div css={[isPrimary ? containerStyles : styles]} />
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from function: css attribute value is css tagged template literal',
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) { return <button css={css\`\`}>{children}</button>; }
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const styles = css\`\`;
					function Button({children}) { return <button css={styles}>{children}</button>; }
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from function: css attribute value is empty object',
				code: outdent`
					function Button({children}) { return <button css={{}}>{children}</button>; }
				`,
				output: outdent`
          import { css } from '@compiled/react';
          const styles = css({});
          function Button({children}) { return <button css={styles}>{children}</button>; }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is empty template literal',
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) { return <button css={\`\`}>{children}</button>; }
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const styles = \`\`;
					function Button({children}) { return <button css={styles}>{children}</button>; }
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from function: css attribute value in css object',
				code: outdent`
          function Button({children}) {
            const containerStyles = {
              padding: 8,
            };//
            return <button css={containerStyles}>{children}</button>;
          }
        `,
				output: outdent`
          const containerStyles = {
              padding: 8,
            };
          function Button({children}) {
            //
            return <button css={containerStyles}>{children}</button>;
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute is css function call',
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) {
						const containerStyles = css({
							padding: 8,
						});//
						return <button css={containerStyles}>{children}</button>;
					}
				`,
				output: `import { css } from '@compiled/react';
const containerStyles = css({
		padding: 8,
	});
function Button({children}) {
	//
	return <button css={containerStyles}>{children}</button>;
}`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from function: css attribute value is css function call, where usage is inside arrow function within function',
				code: outdent`
          function Button({children}) {
            const containerStyles = css({
              padding: 8,
            });//
            return (
              <Component>
                {
                  () => <button css={containerStyles}>{children}</button>
                }
              </Component>
            );
          }
        `,
				output: outdent`
          const containerStyles = css({
              padding: 8,
            });
          function Button({children}) {
            //
            return (
              <Component>
                {
                  () => <button css={containerStyles}>{children}</button>
                }
              </Component>
            );
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is another function that returns a css object',
				code: outdent`
        function Button({children}) {
          const getStyles = () => ({
            padding: 8,
          });

          return <button css={getStyles()}>{children}</button>;
        }
      `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is empty string',
				code: 'function Button({children}) { return <button css="">{children}</button>; }',
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from arrow function: css attribute value is inline css function call',
				code: outdent`
					import { css } from '@compiled/react';
					const Button = ({children}) => { return <button css={css({color: 'red'})}>{children}</button>;}
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const styles = css({color: 'red'});
					const Button = ({children}) => { return <button css={styles}>{children}</button>;}
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from function: css attribute value is inline css function call',
				options: [{ stylesPlacement: 'top' }],
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}){ return <button css={css({color: 'red'})}>{children}</button>;}
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const styles = css({color: 'red'});
					function Button({children}){ return <button css={styles}>{children}</button>;}
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists from arrow function: css attribute value is cssMap function call',
				options: [{ cssFunctions: ['css'] }],
				code: outdent`
					import { cssMap } from '@compiled/react';
					const Component = () => <div css={cssMap({'color': 'red'})} />;
				`,
				output: outdent`
					import { cssMap } from '@compiled/react';
					const styles = cssMap({'color': 'red'});
					const Component = () => <div css={styles} />;
				`,
				errors: [{ messageId: 'cssAtTopOfModule' }],
			},
			{
				name: 'hoists cssMap function call above existing styles variable',
				options: [{ stylesPlacement: 'top', cssFunctions: ['css'] }],
				code: outdent`
          import { css, cssMap } from '@compiled/react';
          const styles = css({color: 'blue'});

          const ComponentTwo = () => <div css={styles} />;
          const Component = () => <div css={cssMap({'color': 'red'})} />;
        `,
				output: outdent`
          import { css, cssMap } from '@compiled/react';
          const styles2 = cssMap({'color': 'red'});
          const styles = css({color: 'blue'});

          const ComponentTwo = () => <div css={styles} />;
          const Component = () => <div css={styles2} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
		],
	},
);
