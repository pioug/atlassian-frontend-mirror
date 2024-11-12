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
		],
	},
);
