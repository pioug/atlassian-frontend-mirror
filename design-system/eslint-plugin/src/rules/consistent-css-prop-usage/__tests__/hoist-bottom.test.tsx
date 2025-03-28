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
			// config for stylesPlacement: 'bottom' ⬇️
			{
				name: 'hoists cssMap function call below existing styles variable',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`<div css={isPrimary && {}} />`,
				output: outdent`
          import { css } from '@compiled/react';
          <div css={isPrimary && styles} />
          const styles = css({});`,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists css object in ternary expression (first branch)',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
          import { css } from '@compiled/react';
          const defaultStyles = css({
            padding: 8,
          });

          <div css={[isPrimary ? {} : defaultStyles]} />
        `,
				output: outdent`
          import { css } from '@compiled/react';
          const defaultStyles = css({
            padding: 8,
          });

          <div css={[isPrimary ? styles : defaultStyles]} />
          const styles = css({});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists css object in ternary expression (second branch)',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					const containerStyles = css({
						padding: 8,
					});

					<div css={[isPrimary ? containerStyles : {}]} />
        `,
				output: outdent`
          import { css } from '@compiled/react';
          const containerStyles = css({
          	padding: 8,
          });

          <div css={[isPrimary ? containerStyles : styles]} />
          const styles = css({});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is css tagged template literal',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) { return <button css={css\`\`}>{children}</button>; }
				`,
				output: outdent`
          import { css } from '@compiled/react';
          function Button({children}) { return <button css={styles}>{children}</button>; }
          const styles = css\`\`;
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is empty object',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) { return <button css={{}}>{children}</button>; }
				`,
				output: outdent`
          import { css } from '@compiled/react';
          function Button({children}) { return <button css={styles}>{children}</button>; }
          const styles = css({});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is empty template literal',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}) { return <button css={\`\`}>{children}</button>; }
				`,
				output: outdent`
          import { css } from '@compiled/react';
          function Button({children}) { return <button css={styles}>{children}</button>; }
          const styles = \`\`;
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value in css object',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
          function Button({children}) {
            const containerStyles = {
              padding: 8,
            };//
            return <button css={containerStyles}>{children}</button>;
          }
        `,
				output: outdent`
          function Button({children}) {
            //
            return <button css={containerStyles}>{children}</button>;
          }
          const containerStyles = {
              padding: 8,
            };
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is css function call',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
          import { css } from '@compiled/react';
          function Button({children}) {
            const containerStyles = css({
              padding: 8,
            });//
            return <button css={containerStyles}>{children}</button>;
          }
        `,
				output: outdent`
					import { css } from '@compiled/react';
					function Button({children}) {
					  //
					  return <button css={containerStyles}>{children}</button>;
					}
					const containerStyles = css({
					    padding: 8,
					  });
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is css function call, where usage is inside arrow function within function',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
          import { css } from '@compiled/react';
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
					import { css } from '@compiled/react';
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
					const containerStyles = css({
					    padding: 8,
					  });
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is another function that returns a css object',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
          import { css } from '@compiled/react';
          function Button({children}) {
            const getStyles = () => ({
              padding: 8,
            });

            return <button css={getStyles()}>{children}</button>;
          }
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is empty string',
				options: [{ stylesPlacement: 'bottom' }],
				code: 'function Button({children}) { return <button css="">{children}</button>; }',
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from arrow function: css attribute value is inline css function call',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					const Button = ({children}) => { return <button css={css({color: 'red'})}>{children}</button>;}
				`,
				output: outdent`
					import { css } from '@compiled/react';
					const Button = ({children}) => { return <button css={styles}>{children}</button>;}
					const styles = css({color: 'red'});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from function: css attribute value is inline css function call',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					import { css } from '@compiled/react';
					function Button({children}){ return <button css={css({color: 'red'})}>{children}</button>;}
				`,
				output: outdent`
					import { css } from '@compiled/react';
					function Button({children}){ return <button css={styles}>{children}</button>;}
					const styles = css({color: 'red'});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists from arrow function: css attribute value is cssMap function call',
				options: [{ stylesPlacement: 'bottom', cssFunctions: ['css'] }],
				code: outdent`
					import { cssMap } from '@compiled/react';
					const Component = () => <div css={cssMap({'color': 'red'})} />;
				`,
				output: outdent`
          import { cssMap } from '@compiled/react';
          const Component = () => <div css={styles} />;
          const styles = cssMap({'color': 'red'});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'hoists cssMap function call below existing styles variable',
				options: [{ stylesPlacement: 'bottom', cssFunctions: ['css'] }],
				code: outdent`
          import { css, cssMap } from '@compiled/react';

          const Component = () => <div css={cssMap({'color': 'red'})} />;
          const ComponentTwo = () => <div css={styles} />;
          const styles = css({color: 'blue'});
        `,
				output: outdent`
          import { css, cssMap } from '@compiled/react';

          const Component = () => <div css={styles2} />;
          const ComponentTwo = () => <div css={styles} />;
          const styles = css({color: 'blue'});
          const styles2 = cssMap({'color': 'red'});
        `,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
		],
	},
);
