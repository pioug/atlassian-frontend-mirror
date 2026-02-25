import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'enforce-style-prop',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'No style attribute used',
				code: `
        <div css={styles} />
      `,
			},
			{
				name: 'Values from props are acceptable',
				code: `
        function Component(props) {
          return <div
            style={{
              width: props.width,
              '--my-nested-width': props.width,
            }}
            css={css({ margin: 0, color: 'red' })}
          />
        }
      `,
			},
			{
				name: 'With an assertion is acceptable',
				code: `
        function Component(props) {
          return <div
            style={{
              width: props.width,
              '--my-nested-width': props.width,
            } as React.CSSProperties}
            css={css({ margin: 0, color: 'red' })}
          />
        }
      `,
			},
			{
				name: 'Values from deconstructed props are acceptable',
				code: `
        function DeconstructionComponent1({ myWidth }) {
          return <div style={{ width: myWidth }}>hello</div>;
        }
      `,
			},
			{
				name: 'Multiple values from deconstructed props are acceptable',
				code: `
        function DeconstructionComponent2({ myWidth, height, myColor = '#fff' }) {
          return <div style={{ width: myWidth, height, color: myColor }}>hello</div>;
        }
      `,
			},
			{
				name: 'Values from inline deconstructed props with an assertion are acceptable',
				code: `
        function DeconstructionComponent2(props: Props) {
					const { myWidth, height, myColor = '#fff' } = props as OtherProps;
          return <div style={{ width: myWidth, height, color: myColor }}>hello</div>;
        }
      `,
			},
			{
				name: 'Skips linting @media query as it is not supported by the style prop anyways',
				code: `
        function Component() {
          return <div
            style={{
              '@media …': { /* ... */ },
            }}
          />
        }
      `,
			},
			{
				name: 'Skips linting selector as it is not supported by the style prop anyways',
				code: `
        function Component() {
          return <div
            style={{
              'button': { /* ... */ },
            }}
          />
        }
      `,
			},
			{
				name: 'Static styles are outside of style attribute',
				code: `
        function Component(props) {
          return (
            <div
              style={{
                width: props.width,
              }}
              css={css({ margin: 0, color: 'red' })}
            />
          );
        }
      `,
			},
			{
				name: 'Props destructured in function via object pattern',
				code: `
        function Component(props) {
          const { width } = props;
          return <div style={{ width: width }} />
        }
      `,
			},
			{
				name: 'Props destructured in function via member expression',
				code: `
        function Component(props) {
          const width = props.width;
          return <div style={{ width: width }} />
        }
      `,
			},
			{
				name: 'Props destructured in function via member expression with assertion',
				code: `
        function Component(props) {
          const width = props.width as string;
          return <div style={{ width: width }} />
        }
      `,
			},
			{
				name: 'Identifier with a BinaryExpression from props using length',
				code: `
					const SERIES_HEIGHT = 20;
					function Component ({ data }) {
						const canvasHeight = data.length * SERIES_HEIGHT;
						return <Component style={{ height: canvasHeight }} />
					}
				`,
			},
			{
				name: 'Identifier with a ConditionalExpression from props using length',
				code: `
					const SERIES_HEIGHT = 20;
					function Component ({ data }) {
						const canvasHeight = data.length ? data.length : SERIES_HEIGHT * 2;
						return <Component style={{ height: canvasHeight }} />
					}
				`,
			},
			{
				name: 'Ignore state variables',
				code: `
        const Component = () => {
          const [state, setState] = useState();
          return <div style={{ width: state.width }} />
        };
      `,
			},
			{
				name: 'Ignore variables initialised by call expression',
				code: `
        const Component = () => {
          const tableWidth = calcDefaultLayoutWidthByAppearance(
            rendererAppearance,
            tableNode,
          );
          return (
            <div style={{ width: tableWidth }} />
          )
        }
      `,
			},
			{
				name: 'Property from object initialisation is ok',
				code: `
        function Component(props) {
          const obj = { width: 0 };
          return <div
            style={{
              width: obj.width
            }}
          />
        }
      `,
			},
			{
				name: 'Full complex objects are okay',
				code: `
        function Component(props) {
					const height = getHeight(props);
          const styles = { width: props.width, height };
          return <div style={styles} />
        }
      `,
			},
			{
				name: 'Let variables are ok',
				code: `
        function Component(props) {
          let width = 0;
          return <div
            style={{
              width
            }}
          />
        }
      `,
			},
			{
				name: 'Ignore function calls',
				code: `
        import { calcDefaultLayoutWidthByAppearance } from '../shared';
        const Component = () => {
          return (
            <div
              style={{
                width: calcDefaultLayoutWidthByAppearance(
                  rendererAppearance,
                  tableNode,
                ),
              }}
            />
          );
        };
      `,
			},
			{
				name: 'Style prop pass-through - member expression',
				code: `
					function Badge(props) {
						return <div style={props.style} />
					}
				`,
			},
			{
				name: 'Style prop pass-through - named function',
				code: `
					function Badge({ style }: BadgeProps) {
						return <div style={style} />
					}
				`,
			},
			{
				name: 'Style prop pass-through - arrow function',
				code: `
					<Manager>
						<Reference>
							{({ ref }) => <div ref={ref} />}
						</Reference>
						<Popper>
							{({ ref, style }: PopperChildrenProps) => {
								return (
									<div
										ref={ref}
										style={style}
									/>
								);
							}}
						</Popper>
					</Manager>
				`,
			},
			{
				name: 'Style prop pass-through - function expression',
				code: `
					const Badge = function Badge({ style }: BadgeProps) {
						return <div style={style} />
					}
				`,
			},
			{
				name: 'Style prop pass-through - destructured from props',
				code: `
					function Component(props) {
						const { style } = props;
						return <div style={style} />;
					}
				`,
			},
		],
		invalid: [
			{
				name: 'Basic test for static css values',
				code: `
        function Component(props) {
          return <div
            style={{
              margin: 0,
              color: 'red',
            }}
          />
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }, { messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Basic test for static css objects',
				code: `
					function Component(props) {
						const styles = { margin: 0, color: 'red' };
						return <div style={styles} />;
					}
      	`,
				errors: [{ messageId: 'enforce-style-prop', line: 4 }],
			},
			{
				name: 'Basic test for mixed css objects',
				code: `
					function Component(props) {
						const styles = {
							margin: props.margin,
							color: 'red',
						};

						return <div style={styles} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop', line: 8 }],
			},
			{
				name: 'Basic test for a class-based component',
				code: `
					class BlankExperience extends Component {
						render () {
							const styles = {
								margin: this.props.margin,
								color: 'red',
							};

							return <div style={styles} />
						}
					}
				`,
				errors: [{ messageId: 'enforce-style-prop', line: 9 }],
			},
			{
				name: 'No constants passed to style',
				code: `
        function Component(props) {
          const color = 'red';
          return <div
            style={{
              color, // should be static css
            }}
          />
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'No spread operator within style',
				code: `
        import importedStyleObj from '../shared';
        function Component(props) {
          const color = 'red';
          return <div
            style={{
              ...importedStyleObj,
              ...props.style
            }}
          />
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }, { messageId: 'enforce-style-prop' }],
			},
			{
				name: 'No imported object passed to style',
				code: `
        import importedStyleObj from '../shared';
        function AnotherComponent() {
          return <div style={importedStyleObj} />;
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'No rest prop',
				code: `
        function Component({ prop1, ...spreadElement }) {
          return <div style={{ 'button': spreadElement }}>hello</div>
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'No token calls',
				code: `
        import { token } from '@atlaskit/tokens';

        function Component() {
          return <div style={{ paddingBottom: token('space.150', '12px') }} />;
        }
      `,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'static Identifier with a BinaryExpression mixed with static length accessor',
				code: `
					const SERIES_HEIGHT = 20;
					const data = [1,2];

					function Component (props) {
						const canvasHeight = SERIES_HEIGHT * data.length;
						return <Component style={{ height: canvasHeight }} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'static Identifier with a BinaryExpression',
				code: `
					const SERIES_HEIGHT = 20;
					function Component (props) {
						const canvasHeight = SERIES_HEIGHT * 2.5;
						return <Component style={{ height: canvasHeight }} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'static Identifier with a ConditionalExpression',
				code: `
					const SERIES_HEIGHT = 20;
					function Component (props) {
						const canvasHeight = SERIES_HEIGHT > 5
							? 2.5
							: SERIES_HEIGHT
								? 10
								: 5;

						return <Component style={{ height: canvasHeight }} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Deep destructing in parameters',
				code: `
					function Component({ other: { style } }) {
						return <div style={style} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Deep destructing in body',
				code: `
					function Component(props) {
					  const { other: { style } } = props;
						return <div style={style} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'MemberExpression on function parameter',
				code: `
					function Component(props) {
						const { style } = props.other;
						return <div style={style} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Deep destructing in body',
				code: `
					function Component(props) {
						const { other: { style } } = props;
						return <div style={style} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Deep prop pass-through',
				code: `
					function Badge(props) {
						return <div style={props.other.style} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Random prop pass-through - member expression',
				code: `
					function Badge(props) {
						return <div style={props.other} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Random prop pass-through - named function',
				code: `
					function Badge({ other }: BadgeProps) {
						return <div style={other} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Random prop pass-through - named function',
				code: `
					function Badge({ other: style }: BadgeProps) {
						return <div style={style} />
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Random prop pass-through - anonymous function',
				code: `
					<Manager>
						<Reference>
							{({ ref }) => <div ref={ref} />}
						</Reference>
						<Popper>
							{({ ref, other }: PopperChildrenProps) => {
								return (
									<div
										ref={ref}
										style={other}
									/>
								);
							}}
						</Popper>
					</Manager>
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Random prop pass-through - destructured from props',
				code: `
					function Component(props) {
						const { other } = props;
						return <div style={other} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
			{
				name: 'Deep style MemberExpression',
				code: `
					function Component({ innerProps }) {
						return <div style={innerProps.style} />;
					}
				`,
				errors: [{ messageId: 'enforce-style-prop' }],
			},
		],
	},
);
