import outdent from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('no-classname-prop', rule, {
	valid: [
		{
			name: 'with no className prop',
			code: outdent`<div />`,
		},
		{
			name: 'function with directly destructured xcss prop',
			code: outdent`
				export function Component({ xcss }) {
					return <div className={xcss} />;
				};
			`,
		},
		{
			name: 'arrow function with directly destructured xcss prop',
			code: outdent`
				export const Component = ({ xcss }) => {
					return <div className={xcss} />;
				};
			`,
		},
		{
			name: 'function with indirectly destructured xcss prop',
			code: outdent`
				export function Component(props) {
					const { xcss } = props;
					return <div className={xcss} />;
				};
			`,
		},
		{
			name: 'arrow function with indirectly destructured xcss prop',
			code: outdent`
				export const Component = (props) => {
					const { xcss } = props;
					return <div className={xcss} />;
				};
			`,
		},
		{
			name: 'function with props.xcss',
			code: outdent`
				export function Component(props) {
					return <div className={props.xcss} />;
				};
			`,
		},
		{
			name: 'arrow function with props.xcss',
			code: outdent`
				export const Component = (props) => {
					return <div className={props.xcss} />;
				};
			`,
		},
		{
			name: 'function with different named xcss props',
			code: outdent`
				export const Component = ({ xcss, containerXcss, labelXcss }) => {
					return (
						<div className={containerXcss}>
							<div className={xcss} />
							<label className={labelXcss} />
						</div>
					);
				};
			`,
		},
	],
	invalid: [
		{
			name: 'pass-through className',
			code: `
        export function Component(props) {
					return <div className={props.className} />;
				};
      `,
			errors: [{ messageId: 'no-classname-prop' }],
		},
		{
			name: 'pass-through with other prop name',
			code: `
        export function Component({ styles }) {
					return <div className={styles} />;
				};
      `,
			errors: [{ messageId: 'no-classname-prop' }],
		},
		{
			name: 'string className',
			code: `
        export function Component(props) {
					return <div className="my-class" />;
				}
      `,
			errors: [{ messageId: 'no-classname-prop' }],
		},
		{
			name: 'pass-through className with a non-native component',
			code: `
        import { styled } from '@compiled/react';
        const Component = styled.div({});

				export function Component(props) {
        	return <Component className={props.className} />;
				}
      `,
			errors: [{ messageId: 'no-classname-prop' }],
		},
		{
			name: 'string className with a non-native component',
			code: `
        import { styled } from '@compiled/react';
        const Component = styled.div({});

				export function Component(props) {
        	return <Component className="string" />;
				}
      `,
			errors: [{ messageId: 'no-classname-prop' }],
		},
	],
});
