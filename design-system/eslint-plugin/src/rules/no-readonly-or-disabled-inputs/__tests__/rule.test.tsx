import { tester } from '../../__tests__/utils/_tester';
import { AFFECTED_ATLASKIT_PACKAGES } from '../affected-atlaskit-packages';
import { AFFECTED_HTML_ELEMENTS } from '../affected-html-elements';
import rule from '../index';
import { UNWANTED_ATLASKIT_ATTRIBUTES } from '../unwanted-atlaskit-attributes';
import { UNWANTED_HTML_ATTRIBUTES } from '../unwanted-html-attributes';

tester.run('no-readonly-or-disabled-inputs', rule, {
	valid: [
		`
			// Ignore non-input HTML elements
      <p disabled>Hello</p>
    `,
		`
      // Ignore inputs without unwanted attributes
      <input />
    `,
		`
			// Ignore non-DS inputs
			import Textfield from '@foo/textfield';

			<Textfield placeholder="foo" />
    `,
		`
			// Ignore DS input with no unwanted
			import Textfield from '@atlaskit/textfield';

			<Textfield />
    `,
		`
			// Ignore DS import from input package that is not one of the ones we are focusing on
			import { BingBongInput } from '@atlaskit/textfield';

			<BingBongInput disabled />
    `,
	],
	invalid: [
		...AFFECTED_HTML_ELEMENTS.map((elementName) => {
			const unwantedAttrAndMessageId = UNWANTED_HTML_ATTRIBUTES.map((attrName) => [
				attrName,
				`no${attrName === 'disabled' ? 'Disabled' : 'ReadOnly'}`,
			]);
			return unwantedAttrAndMessageId.map(([attrName, messageId]) => [
				{
					code: `
				// HTML input with ${attrName}
				<${elementName} ${attrName} />
			`,
					errors: [
						{
							messageId,
						},
					],
				},
			]);
		}).flat(),
		...Object.keys(AFFECTED_ATLASKIT_PACKAGES)
			.map((packageName) => {
				const unwantedAttrAndMessageId = UNWANTED_ATLASKIT_ATTRIBUTES.map((attrName) => [
					attrName,
					`no${attrName === 'isDisabled' ? 'Disabled' : 'ReadOnly'}`,
				]);
				return unwantedAttrAndMessageId.map(([attrName, messageId]) => [
					{
						code: `
					// DS input with placeholder
					import Default from '${packageName}';
					<Default ${attrName} />
				`,
						errors: [
							{
								messageId,
							},
						],
					},
					{
						code: `
					// Renamed DS input with placeholder
					import AkDefault from '${packageName}';
					<AkDefault ${attrName} />
				`,
						errors: [
							{
								messageId,
							},
						],
					},
				]);
			})
			.flat(),
		...AFFECTED_HTML_ELEMENTS.map((elementName) => ({
			code: `
				// HTML input with both attributes
				<${elementName} disabled readonly />
			`,
			errors: [
				{
					messageId: 'noDisabled',
				},
				{
					messageId: 'noReadOnly',
				},
			],
		})),
		...Object.keys(AFFECTED_ATLASKIT_PACKAGES).map((packageName) => ({
			code: `
					// DS input with placeholder
					import Default from '${packageName}';
					<Default isDisabled isReadOnly />
			`,
			errors: [
				{
					messageId: 'noDisabled',
				},
				{
					messageId: 'noReadOnly',
				},
			],
		})),
	].flat(),
});
