import { tester } from '../../__tests__/utils/_tester';
import rule, { name, noDeprecatedJSXAttributeMessageId } from '../index';

import defaultMeta from './__fixtures__/default.json';
import hasNamedSpecifiers from './__fixtures__/has-named-specifiers.json';

tester.run(name, rule, {
	valid: [
		{
			name: 'cssFn 1',
			code: `
				import { SomeElement } from 'some-other-library';

				const Element = () => (
					<SomeElement cssFn={cssFn()} />
				);
			`,
		},
		{
			name: 'cssFn 2',
			code: `
				import { SomeElement } from 'some-other-library';

				const Element = () => (
					<SomeElement cssFn={cssFn()} />
				);
			`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'ButtonItem 1',
			code: `
				import { ButtonItem } from '@atlaskit/menu';

				const Element = () => (
					<ButtonItem />
				);
			`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'ButtonItem 1',
			code: `
				import { ButtonItem } from '@atlaskit/side-navigation';

				const Element = () => (
					<SomeUsage cssFn={cssFn()}>
						<ButtonItem />
					</SomeUsage>
				);
			`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'InlineMessage 1',
			code: `
				import InlineMessage from '@atlaskit/inline-message';

				const Element = () => (
					<InlineMessage appearance='connectivity' />
				);
			`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'InlineMessage 2',
			code: `
				import { Section } from '@atlaskit/inline-message';

				const Element = () => (
					<Section cssFn2={cssFn()} />
				);
			`,
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
	],

	invalid: [
		{
			name: 'ButtonItem 1',
			code: `
				import { ButtonItem } from '@atlaskit/menu';

				const Element = () => (
					<ButtonItem cssFn={cssFn()} />
				);
			`,
			options: [{ deprecatedConfig: defaultMeta }],
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
		},
		{
			name: 'ButtonItem 2',
			code: `
				import { ButtonItem } from '@atlaskit/side-navigation';

				const Element = () => (
					<ButtonItem cssFn={cssFn()} />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'ButtonItem 3',
			code: `
				import { ButtonItem } from '@atlaskit/side-navigation';

				const Element = () => (
					<ButtonItem overrides={{ Item: { cssFn }}} />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'ButtonItem 4',
			code: `
				import { ButtonItem } from '@atlaskit/menu';

				const Element = () => (
					<ButtonItem overrides={{ Item: { cssFn }}} />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'ButtonItem 5',
			code: `
				import { ButtonItem } from '@atlaskit/menu';

				const Element = () => (
					<ButtonItem cssFn2={cssFn()} />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
		{
			name: 'InlineMessage 1',
			code: `
				import InlineMessage from '@atlaskit/inline-message';

				const Element = () => (
					<InlineMessage type='connectivity' />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			name: 'MenuGroup',
			code: `
				import { MenuGroup } from '@atlaskit/menu';

				const Element = () => (
					<MenuGroup cssFn2={cssFn()} />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
		{
			name: 'Heading',
			code: `
				import Heading from '@atlaskit/heading';

				const Element = () => (
					<Heading level="h700" />
				);
			`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
	],
});
