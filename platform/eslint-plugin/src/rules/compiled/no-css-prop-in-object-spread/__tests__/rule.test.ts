import { outdent } from 'outdent';

import { tester } from '../../../../__tests__/utils/_tester';
import { noCssPropInObjectSpread } from '../index';

tester.run('no-css-prop-in-object-spread', noCssPropInObjectSpread, {
	valid: [
		{
			name: 'direct css JSX prop — correct usage',
			code: outdent`
				function Foo() {
					return <div css={styles} />;
				}
			`,
		},
		{
			name: 'object spread without a css key',
			code: outdent`
				function Foo() {
					const props = { id: 'foo', tabIndex: 0 };
					return <div {...props} />;
				}
			`,
		},
		{
			name: 'css as a plain data key, never spread into JSX',
			code: outdent`
				const storedPrefs = { css: 'user-defined-class', fontSize: 14 };
				saveToStorage(storedPrefs);
			`,
		},
		{
			name: 'inline spread without css key',
			code: outdent`
				function Foo() {
					return <div {...{ id: 'foo' }} />;
				}
			`,
		},
		{
			name: 'variable not traceable to a plain object — no false positive',
			code: outdent`
				function Foo() {
					const props = getProps();
					return <div {...props} />;
				}
			`,
		},
	],
	invalid: [
		{
			name: 'inline object literal with css key alongside other props',
			code: outdent`
				function Foo() {
					return <div {...{ css: styles, id: 'foo' }} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					return <div css={styles} {...{ id: 'foo' }} />;
				}
			`,
		},
		{
			name: 'inline object with only the css key — spread removed entirely',
			code: outdent`
				function Foo() {
					return <div {...{ css: styles }} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					return <div css={styles} />;
				}
			`,
		},
		{
			name: "inline object with css as string key ('css')",
			code: outdent`
				function Foo() {
					return <div {...{ 'css': styles }} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					return <div css={styles} />;
				}
			`,
		},
		{
			name: 'variable reference — single spread site (auto-fixed), css is first',
			code: outdent`
				function Foo() {
					const props = { css: dropZoneStyles, tabIndex: 0 };
					return <div {...props} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					const props = { tabIndex: 0 };
					return <div css={dropZoneStyles} {...props} />;
				}
			`,
		},
		{
			name: 'variable reference — css is the only prop, object becomes empty',
			code: outdent`
				function Foo() {
					const props = { css: dropZoneStyles };
					return <div {...props} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					const props = {};
					return <div css={dropZoneStyles} {...props} />;
				}
			`,
		},
		{
			name: 'variable with multiple props, css is last',
			code: outdent`
				function Foo() {
					const props = { tabIndex: 0, css: dropZoneStyles };
					return <div {...props} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					const props = { tabIndex: 0 };
					return <div css={dropZoneStyles} {...props} />;
				}
			`,
		},
		{
			name: 'spread inside .map()',
			code: outdent`
				function Foo() {
					return items.map(item => <span key={item.id} {...{ css: styles, role: 'button' }} />);
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					return items.map(item => <span key={item.id} css={styles} {...{ role: 'button' }} />);
				}
			`,
		},
		{
			name: 'multiple spreads on same element, only one with css',
			code: outdent`
				function Foo() {
					return <div {...{ id: 'x' }} {...{ css: styles }} />;
				}
			`,
			errors: [{ messageId: 'noCssPropInObjectSpread' }],
			output: outdent`
				function Foo() {
					return <div {...{ id: 'x' }} css={styles} />;
				}
			`,
		},
	],
});
