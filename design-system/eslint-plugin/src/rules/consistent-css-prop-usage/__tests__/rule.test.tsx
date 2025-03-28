import outdent from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'react/consistent-css-prop-usage',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'valid cssMap usage passed to cx in css prop',
				code: outdent`
					import { cssMap } from '@compiled/react';
          const styles = cssMap({ root: { color: 'red' } });

          <Button xcss={cx(styles.root)} />
        `,
			},
			{
				name: 'non-existent value passed to css prop',
				code: outdent`
          <button css={asdasd} />
        `,
			},
			{
				name: 'not using css prop',
				code: 'function Button({children}) { return <button someCss={{}}>{children}</button>; }',
			},
			{
				name: 'css prop value already hoisted',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
			},
			{
				name: 'css prop contains array with values already hoisted',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });
          const baseContainerStyles = css({
            padding: 10,
          });

          function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
        `,
			},
			{
				name: 'css prop contains logical expression',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          <div css={isPrimary && containerStyles} />
        `,
			},
			{
				name: 'css prop contains array with logical expression',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          <div css={[isPrimary && containerStyles]} />
        `,
			},
			{
				name: 'css prop contains ternary expression',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          <div css={isPrimary ? containerStyles : null} />
        `,
			},
			{
				name: 'css prop contains ternary expression in array',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          <div css={[isPrimary ? containerStyles : null]} />
        `,
			},
			{
				// this looks invalid but because we are saying we only want to target `xcss` no error is raised
				name: "doesn't error for css attribute when cssFunctions doesn't contain css",
				options: [{ cssFunctions: ['xcss'] }],
				code: outdent`
					import { css } from '@compiled/react';
          const container = css({});

          <div css={container} />
        `,
			},
			{
				// this looks invalid but because we are saying we only want to target `css` no error is raised
				name: "doesn't error for xcss attribute when cssFunctions doesn't contain xcss",
				options: [{ cssFunctions: ['css'] }],
				code: outdent`
					import { xcss } from '@atlaskit/primitives';
          const container = xcss({});

          <div xcss={container} />
        `,
			},
			{
				// this looks invalid but because we are saying we only want to target `xcss` no error is raised
				name: "doesn't error for css attribute when cssFunctions doesn't contain css (with logical expression)",
				options: [{ cssFunctions: ['xcss'] }],
				code: outdent`<div css={isPrimary && {}} />`,
			},
			{
				// this looks invalid but because we are saying we only want to target `css` no error is raised
				name: "doesn't error for xcss attribute when cssFunctions doesn't contain xcss (with logical expression)",
				options: [{ cssFunctions: ['css'] }],
				code: outdent`<div xcss={isPrimary && {}} />`,
			},
			{
				// this looks invalid but because we are saying we only want to target `xcss` no error is raised
				name: "doesn't error for css attribute when cssFunctions doesn't contain css (with imported value)",
				options: [{ cssFunctions: ['xcss'] }],
				code: outdent`
          import { containerStyles } from './styles';

          function Button({children}) {
            return <button css={containerStyles}>{children}</button>;
          }
        `,
			},
			{
				// this looks invalid but because we are saying we only want to target `css` no error is raised
				name: "doesn't error for xcss attribute when cssFunctions doesn't contain xcss (with imported value)",
				options: [{ cssFunctions: ['css'] }],
				code: outdent`
          import { containerStyles } from './styles';

          function Button({children}) {
            return <Box xcss={containerStyles}>{children}</Box>;
          }
        `,
			},
			{
				// cssMap objects accessed using string literal
				name: 'valid cssMap usage, using string literal',
				options: [{ cssFunctions: ['css'] }],
				code: outdent`
          import { cssMap } from '@compiled/react';
          const borderStyleMapStyles = cssMap({
            'no.border': { borderStyle: 'none' },
            solid: { borderStyle: 'solid' },
          });

          const Component = () => <div css={borderStyleMapStyles['no.border']} />;
        `,
			},
			{
				// cssMap objects accessed using props
				name: 'valid cssMap usage, using props',
				options: [{ cssFunctions: ['xcss'] }],
				code: outdent`
          import { cssMap } from '@compiled/react';
          const borderStyleMapStyles = cssMap({
            'no.border': { borderStyle: 'none' },
            solid: { borderStyle: 'solid' },
          });

          const Component = ({ variant }) => <div xcss={borderStyleMapStyles[variant]} />;
        `,
			},
			{
				name: 'excludes react components if excludeReactComponents = true',
				options: [{ excludeReactComponents: true }],
				code: outdent`
          import { Component } from './other-file';
          const ComponentTwo = () => <Component css={{ color: 'blue' }} />;
        `,
			},
			{
				name: 'excludes member expression components if excludeReactComponents = true',
				options: [{ excludeReactComponents: true }],
				code: outdent`const ComponentTwo = () => <item.before css={{ color: 'blue' }} />;`,
			},
			{
				name: 'excludes capitalized member expression components if excludeReactComponents = true',
				options: [{ excludeReactComponents: true }],
				code: outdent`const ComponentTwo = () => <Item.before css={{ color: 'blue' }} />;`,
			},
			{
				name: 'excludes doubly-capitalized member expression components if excludeReactComponents = true',
				options: [{ excludeReactComponents: true }],
				code: outdent`const ComponentTwo = () => <Item.Before css={{ color: 'blue' }} />;`,
			},
			{
				name: 'excludes xcss when excludeReactComponents = true',
				options: [{ excludeReactComponents: true }],
				code: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const Component = () => {
						return <Box xcss={{ color: 'red' }} />
					}
				`,
			},
			{
				name: 'parses exported, hoisted css function calls correctly',
				code: outdent`
					import { css } from '@compiled/react';
          export const wrapper: any = css({
            boxSizing: 'border-box',
            height: '100%',
          });

          export const content: any = css({
            padding: 0,
            height: '100%',
            boxSizing: 'border-box',
          });

          const Hello = () => {
            return (
              <div css={wrapper}>
                <div css={content}>
                </div>
              </div>
            );
          };
        `,
			},
			{
				// This is a limitation with the rule.
				name: "doesn't process styles in member expression",
				code: outdent`
          import { css } from '@compiled/react';

          const styles = {
            myStyles: css({ color: 'blue' }),
          };
          <div css={styles.myStyles} />
        `,
			},
			{
				name: "doesn't process styles in class",
				code: outdent`
          import { css } from '@compiled/react';

          class Hello {
            private styles = css({
              color: 'blue',
            });

            myFunction() {
              return <div css={this.styles} />;
            }
          }
        `,
			},
			{
				name: 'xcss pass-through',
				code: outdent`
					import { Box } from '@atlaskit/primitives/compiled';

					function Component({ xcss, children }) {
						return <Box xcss={xcss}>{children}</Box>;
					}
				`,
			},
			{
				name: 'xcss pass-through with alias',
				code: outdent`
					import { Box } from '@atlaskit/primitives/compiled';

					function Component({ xcss: myXcss, children }) {
						return <Box xcss={myXcss}>{children}</Box>;
					}
				`,
			},
			{
				name: 'xcss pass-through with cx',
				code: outdent`
					import { cssMap, cx } from '@compiled/react';
					import { Box } from '@atlaskit/primitives/compiled';

					const styles = cssMap({
						root: {
							color: 'red',
						}
					});

					function Component({ xcss, children }) {
						return <Box xcss={cx(styles.root, xcss)}>{children}</Box>;
					}
				`,
			},
			{
				name: 'xcss pass-through inside a render prop function',
				code: outdent`
					import { cssMap, cx } from '@compiled/react';
					import { Box } from '@atlaskit/primitives/compiled';

					const styles = cssMap({
						root: {
							color: 'red',
						}
					});

					function Component({ xcss, children }) {
						return <Something>{() => <Box xcss={xcss}>{children}</Box>}</Something>;
					}
				`,
			},
			{
				name: 'allows a renamed css import',
				code: outdent`
					import { css as css2 } from '@compiled/react';
					import { css as cssBounded } from '@atlaskit/css';

					const boundedStyles = cssBounded({ display: 'block' });
					const unboundedStyles = css2({ color: 'red' });

					function Component({ children }) {
						return <div css={[boundedStyles, unboundedStyles]}>{children}</div>;
					}
				`,
			},
			{
				name: 'allows a renamed cssMap import',
				code: outdent`
					import { cssMap as cssMapUnbounded } from '@compiled/react';
					import { cssMap as cssMapBounded } from '@atlaskit/css';

					const boundedStyles = cssBounded({ root: { display: 'block' } });
					const unboundedStyles = cssMapUnbounded({ root: { color: 'red' } });

					function Component({ children }) {
						return <div css={[boundedStyles.root, unboundedStyles.root]}>{children}</div>;
					}
				`,
			},
		],
		invalid: [
			{
				name: 'adds css function call to css object',
				code: outdent`
          const containerStyles = {
            padding: 8,
          };

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
				output: outdent`
          import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
				errors: [
					{
						messageId: 'cssObjectTypeOnly',
					},
				],
			},
			{
				name: 'adds css function call to template string',
				code: outdent`
          const containerStyles = \`
            padding: 8,
          \`;

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
				output: outdent`
          import { css } from '@compiled/react';
          const containerStyles = css\`
            padding: 8,
          \`;

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
				errors: [
					{
						messageId: 'cssObjectTypeOnly',
					},
				],
			},
			{
				name: "errors but doesn't autofix when using css tagged template expression",
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css\`
            padding: 8,
          \`;

          function Button({children}) { return <button css={containerStyles}>{children}</button>; }
        `,
				errors: [
					{
						messageId: 'cssObjectTypeOnly',
					},
				],
			},
			...['css', 'xcss'].flatMap((style) => [
				{
					name: "doesn't hoist custom function call returning an object",
					code: outdent`
            const getStyles = (padding) => ({
              padding,
            });

            function Button({children,padding}) {
              return <button ${style}={getStyles(padding)}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssAtTopOfModule',
						},
					],
				},
				{
					name: "errors but doesn't autofix when using css tagged template expression through array",
					code: outdent`
            import { ${style} } from '@any/package';
            const containerStyles = ${style}({
              padding: 8,
            });
            const baseContainerStyles = ${style}\`
              padding: 10,
            \`;

            function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>; }
          `,
					errors: [
						{
							messageId: 'cssObjectTypeOnly',
						},
					],
				},
				{
					name: "doesn't hoist custom function call returning an object (through array)",
					code: outdent`
						import { ${style} } from '@any/package';
            const containerStyles = ${style}({
              padding: 8,
            });
            const getStyles = (padding) => ({
              padding,
            });

            function Button({children,padding}) {
              return <button ${style}={[containerStyles, getStyles(padding)]}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssAtTopOfModule',
						},
					],
				},
				{
					name: `hoists ${style} function call in ${style} prop`,
					code: outdent`
						import { ${style} } from '@any/package';
						function Button({children}) { return <button ${style}={${style}({})}>{children}</button>; }
					`,
					output: outdent`
						import { ${style} } from '@any/package';
						const styles = ${style}({});
						function Button({children}) { return <button ${style}={styles}>{children}</button>; }
					`,
					errors: [
						{
							messageId: 'cssAtTopOfModule',
						},
					],
				},
				{
					name: `doesn't hoist unknown function call in ${style} prop`,
					code: outdent`
						function Button({children}) { return <button ${style}={someCss({})}>{children}</button>; }
					`,
					errors: [
						{
							messageId: 'cssAtTopOfModule',
						},
					],
				},
				{
					name: `doesn't hoist imported styles in ${style} prop`,
					code: outdent`
            import { containerStyles } from './styles';

            function Button({children}) {
              return <button ${style}={containerStyles}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssInModule',
						},
					],
				},
				{
					name: `doesn't hoist imported styles (default import) in ${style} prop`,
					code: outdent`
            import containerStyles from './styles';

            function Button({children}) {
              return <button ${style}={containerStyles}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssInModule',
						},
					],
				},
				{
					name: `doesn't hoist imported styles in array in ${style} prop`,
					code: outdent`
						import { ${style} } from '@any/package';
            import { baseContainerStyles } from './styles';

            const containerStyles = ${style}({
              padding: 8,
            });

            function Button({children}) {
              return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssInModule',
						},
					],
				},
				{
					name: `doesn't hoist imported styles (default import) in array in ${style} prop`,
					code: outdent`
						import { ${style} } from '@any/package';
            import baseContainerStyles from './styles';

            const containerStyles = ${style}({
              padding: 8,
            });

            function Button({children}) {
              return <button ${style}={[containerStyles, baseContainerStyles]}>{children}</button>;
            }
          `,
					errors: [
						{
							messageId: 'cssInModule',
						},
					],
				},
				{
					name: `errors for spread operator in ${style} prop`,
					code: outdent`
						import { ${style} } from '@any/package';
            const baseContainerStyles = ${style}({
              padding: 10,
            });
            const containerStyles = ${style}({
              ...baseContainerStyles,
              padding: 8,
            });

            function Button({children}) { return <button ${style}={containerStyles}>{children}</button>; }
          `,
					errors: [
						{
							messageId: 'cssArrayStylesOnly',
							line: 6,
						},
					],
				},
				{
					name: `errors for spread operator in array in ${style} prop`,
					code: outdent`
						import { ${style} } from '@any/package';
            const baseContainerStyles = ${style}({
              padding: 10,
            });
            const containerStyles = ${style}({
              padding: 8,
            });
            const newContainerStyles = ${style}({
              ...baseContainerStyles,
              padding: 12,
            });

            function Button({children}) { return <button ${style}={[containerStyles, baseContainerStyles, newContainerStyles]}>{children}</button>; }
          `,
					errors: [
						{
							messageId: 'cssArrayStylesOnly',
						},
					],
				},
			]),
			{
				name: 'adds css function call to css object in array',
				code: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });
          const baseContainerStyles = {
            padding: 10,
          };

          function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
        `,
				output: outdent`
					import { css } from '@compiled/react';
          const containerStyles = css({
            padding: 8,
          });
          const baseContainerStyles = css({
            padding: 10,
          });

          function Button({children}) { return <button css={[containerStyles, baseContainerStyles]}>{children}</button>; }
				`,
				errors: [
					{
						messageId: 'cssObjectTypeOnly',
					},
				],
			},
			{
				name: 'adds css function call to xcss object',
				code: outdent`
          import { xcss } from '@atlaskit/primitives';
          const containerStyles = xcss({
            padding: 8,
          });
          const baseContainerStyles = {
            padding: 10,
          };

          function Button({children}) { return <button xcss={[containerStyles, baseContainerStyles]}>{children}</button>; }
        `,
				output: outdent`
          import { xcss } from '@atlaskit/primitives';
          const containerStyles = xcss({
            padding: 8,
          });
          const baseContainerStyles = xcss({
            padding: 10,
          });

          function Button({children}) { return <button xcss={[containerStyles, baseContainerStyles]}>{children}</button>; }
        `,
				errors: [
					{
						messageId: 'cssObjectTypeOnly',
					},
				],
			},
			{
				name: 'hoists from function: css object in ternary expression',
				code: outdent`
					import { css } from '@compiled/react';
          const styles = css({color: 'red'});

          const Component = () => {
            return <div css={isPrimary ? styles : {}}/>
          }
        `,
				output: outdent`
					import { css } from '@compiled/react';
          const styles2 = css({});
					const styles = css({color: 'red'});

          const Component = () => {
            return <div css={isPrimary ? styles : styles2}/>
          }
				`,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'enforces rule for packages in cssImportSource',
				options: [{ cssImportSource: 'custom-package' }],
				code: outdent`const ComponentTwo = () => <div css={{ color: 'blue' }} />;`,
				output: outdent`
          import { css } from 'custom-package';
          const styles = css({ color: 'blue' });
          const ComponentTwo = () => <div css={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'enforces rule for packages in xcssImportSource',
				options: [{ xcssImportSource: 'custom-package' }],
				code: outdent`
          import { Box } from '@atlaskit/primitives';
          const ComponentTwo = () => <Box xcss={{ color: 'blue' }} />;
        `,
				output: outdent`
          import { xcss } from 'custom-package';
          import { Box } from '@atlaskit/primitives';
          const styles = xcss({ color: 'blue' });
          const ComponentTwo = () => <Box xcss={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "cssImportSource value doesn't affect xcssImportSource",
				options: [{ cssImportSource: 'custom-package' }],
				code: outdent`
          import { Box } from '@atlaskit/primitives';
          const ComponentTwo = () => <Box xcss={{ color: 'blue' }} />;
        `,
				output: outdent`
          import { Box, xcss } from '@atlaskit/primitives';

          const styles = xcss({ color: 'blue' });
          const ComponentTwo = () => <Box xcss={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "xcssImportSource value doesn't affect cssImportSource",
				options: [{ xcssImportSource: 'custom-package' }],
				code: outdent`const ComponentTwo = () => <div css={{ color: 'blue' }} />;`,
				output: outdent`
          import { css } from '@compiled/react';
          const styles = css({ color: 'blue' });
          const ComponentTwo = () => <div css={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists when component name is react component',
				options: [{ excludeReactComponents: false }],
				code: outdent`
          import { Component } from './other-file';
          const ComponentTwo = () => <Component css={{ color: 'blue' }} />;
        `,
				output: outdent`
          import { css } from '@compiled/react';
          import { Component } from './other-file';
          const styles = css({ color: 'blue' });
          const ComponentTwo = () => <Component css={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists when component name is member expression',
				options: [{ excludeReactComponents: false }],
				code: outdent`
          import { component } from './other-file';
          const ComponentTwo = () => <component.before css={{ color: 'blue' }} />;
        `,
				output: outdent`
          import { css } from '@compiled/react';
          import { component } from './other-file';
          const styles = css({ color: 'blue' });
          const ComponentTwo = () => <component.before css={styles} />;
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist css object containing local variable",
				code: outdent`
          export const BannerAnimation = () => {
            const abcd = '500px';
            return <div css={{
              margin: abcd,
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist css object containing template literal with local variable",
				code: outdent`
          export const BannerAnimation = () => {
            const abcd = '500';
            return <div css={{
              margin: \`\${abcd}px\`,
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist when css object contains props",
				code: outdent`
          export const BannerAnimation = (props) => {
            const abcd = '500';
            return <div css={{
              margin: props.value,
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist when css object contains template literal with props",
				code: outdent`
          export const BannerAnimation = (props) => {
            const abcd = '500';
            return <div css={{
              margin: \`10px \${props.value} 30px\`,
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists css object containing imported variable',
				code: outdent`
          import { abcd } from 'custom-package';

          export const BannerAnimation = () => {
            const abcd = '500';
            return <div css={{
              margin: abcd,
            }}></div>
          };
        `,
				output: outdent`
          import { css } from '@compiled/react';
          import { abcd } from 'custom-package';

          const styles = css({
              margin: abcd,
            });
          export const BannerAnimation = () => {
            const abcd = '500';
            return <div css={styles}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				// Imported function call
				// We don't currently try to parse this, so we don't
				// hoist it out of caution.
				name: "doesn't hoist css object containing imported function",
				code: outdent`
          import { abcd } from 'custom-package';

          export const BannerAnimation = () => {
            const otherVariable = '500';
            return <div css={{
              margin: abcd(),
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				// Spread element with local variable
				name: "doesn't hoist css function call containing spread element with local variable",
				code: outdent`
          import { css } from '@compiled/react';

          const Component = () => {
            const height = 50;
            return <div
              ref={ref}
              css={css({
                  ...(!height && {
                      visibility: 'hidden',
                  }),
              })} />
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				// Template literal (too complicated to hoist)
				name: "doesn't hoist css object with template literal",
				code: outdent`
          import { abcd } from 'custom-package';

          export const BannerAnimation = () => {
            const abcd = '500';
            return <div css={{
              margin: \`\${abcd}px\`,
            }}></div>
          };
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist css function call containing ternary expression with local variable",
				code: outdent`
          import { css } from '@compiled/react';

          const Component = () => {
            const loading = true;
            return <div
              ref={ref}
              css={css({
                display: loading ? 'none' : 'block',
              })} />
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: "doesn't hoist css function call with css object variable passed to it",
				code: outdent`
          import { css } from '@compiled/react';

          const sectionCustomCssExperiment = {
            color: 'blue',
          };

          <div css={[ff('feature-flag') ? css(sectionCustomCssExperiment) : undefined]} />
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from if block',
				code: outdent`
          import { css } from '@compiled/react';

          if (true) {
            const styles = css({
              color: 'blue',
            });//
            <div css={styles} />
          }
        `,
				output: outdent`
          import { css } from '@compiled/react';

          const styles = css({
              color: 'blue',
            });
          if (true) {
            //
            <div css={styles} />
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from if block inside function',
				code: outdent`
          import { css } from '@compiled/react';

          const Component = () => {
            if (true) {
              const styles = css({
                color: 'blue',
              });//
              return <div css={styles} />;
            }

            return <div />;
          }
        `,
				output: outdent`
          import { css } from '@compiled/react';

          const styles = css({
                color: 'blue',
              });
          const Component = () => {
            if (true) {
              //
              return <div css={styles} />;
            }

            return <div />;
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from block scope',
				code: outdent`
          import { css } from '@compiled/react';

          {
            const styles = css({
              color: 'blue',
            });//
            <div css={styles} />
          }
        `,
				output: outdent`
          import { css } from '@compiled/react';

          const styles = css({
              color: 'blue',
            });
          {
            //
            <div css={styles} />
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'hoists from variable in class',
				code: outdent`
          import { css } from '@compiled/react';

          class Hello {
            myFunction() {
              const styles = css({
                color: 'blue',
              });//
              return <div css={styles} />;
            }
          }
        `,
				output: outdent`
          import { css } from '@compiled/react';

          const styles = css({
                color: 'blue',
              });
          class Hello {
            myFunction() {
              //
              return <div css={styles} />;
            }
          }
        `,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'skips auto-fix if assigned css object contains values defined in function scope',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					function Button({ children, ...props }) {
						const containerStyles = {
							padding: props.padding,
						};
						return (
							<button css={containerStyles}>
								{children}
							</button>
						);
					}
				`,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'skips auto-fix if assigned css function call contains values defined in function scope',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					function Button(props) {
						const containerStyles = css({
							padding: props.padding,
						});
						return (
							<button css={containerStyles}>
								{props.children}
							</button>
						);
					}
				`,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'skips auto-fix if assigned css function call contains values indirectly defined in function scope',
				options: [{ stylesPlacement: 'bottom' }],
				code: outdent`
					function Button(props) {
						const padding = props.padding;
						const containerStyles = css({
							padding,
						});
						return (
							<button css={containerStyles}>
								{props.children}
							</button>
						);
					}
				`,
				errors: [
					{
						messageId: 'cssAtBottomOfModule',
					},
				],
			},
			{
				name: 'auto-fixes inlined xcss objects',
				code: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const Component = () => {
						return <Box xcss={{ color: 'red' }} />
					}
				`,
				output: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const styles = xcss({ color: 'red' });
					const Component = () => {
						return <Box xcss={styles} />
					}
				`,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'auto-fixes inlined xcss functions',
				code: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const Component = () => {
						return <Box xcss={xcss({ color: 'red' })} />
					}
				`,
				output: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const styles = xcss({ color: 'red' });
					const Component = () => {
						return <Box xcss={styles} />
					}
				`,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'auto-fixes xcss when excludeReactComponents = true && shouldAlwaysCheckXcss = true',
				options: [{ excludeReactComponents: true, shouldAlwaysCheckXcss: true }],
				code: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const Component = () => {
						return <Box xcss={{ color: 'red' }} />
					}
				`,
				output: outdent`
					import { Box, xcss } from '@atlaskit/primitives';
					const styles = xcss({ color: 'red' });
					const Component = () => {
						return <Box xcss={styles} />
					}
				`,
				errors: [
					{
						messageId: 'cssAtTopOfModule',
					},
				],
			},
			{
				name: 'xcss pass-through to css prop',
				code: outdent`
					function Component({ xcss, children }) {
						return <div css={xcss}>{children}</div>;
					}
				`,
				errors: [
					{
						messageId: 'cssInModule',
					},
				],
			},
			{
				name: 'passing xcss function to xcss prop',
				code: outdent`
					import { Box, xcss } from '@atlaskit/primitives';

					function Component({ children }) {
						return <Box xcss={xcss}>{children}</Box>;
					}
				`,
				errors: [
					{
						messageId: 'cssInModule',
					},
				],
			},
		],
	},
);
