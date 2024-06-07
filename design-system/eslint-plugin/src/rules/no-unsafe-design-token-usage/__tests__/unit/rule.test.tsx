import renameMapping from '@atlaskit/tokens/rename-mapping';

import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

// Mock default values in case they change
jest.mock('@atlaskit/tokens/token-default-values', () => ({
	__esModule: true,
	default: { 'color.text': '#172B4D' },
}));

// Mock rename mapping in case it changes
jest.mock('@atlaskit/tokens/rename-mapping', () => ({
	__esModule: true,
	default: [
		{
			path: 'tokenName.old',
			state: 'deleted',
			replacement: 'tokenName.new',
		},
		{
			// Ensure [default] is omitted from path
			path: 'tokenName.foo.old.[default]',
			state: 'deleted',
			replacement: 'tokenName.foo.new.[default]',
		},
		{
			path: 'tokenName.deprecated',
			state: 'deprecated',
			replacement: 'tokenName.new',
		},
		{
			path: 'spacing.gutter',
			state: 'experimental',
			// This feature checks if the replacement is an existing token
			replacement: 'space.100',
		},
		{
			path: 'example.token.with.replacement.that.is.not.a.token',
			state: 'experimental',
			replacement: '8px',
		},
	],
}));

const oldTokenName = renameMapping[0].path;
const newTokenName = renameMapping[0].replacement;
const experimentalTokenName1 = renameMapping[3].path;
const experimentalTokenReplacement1 = renameMapping[3].replacement;
const experimentalTokenName2 = renameMapping[4].path;
const experimentalTokenReplacement2 = renameMapping[4].replacement;

tester.run('no-unsafe-design-token-usage', rule, {
	valid: [
		// Using config -> shouldEnforceFallbacks: false
		{
			code: `token('elevation.shadow.raised')`,
		},
		{
			code: `const background = 'hey';`,
		},
		{
			code: `import { e100 } from 'lib';`,
		},
		{
			code: `css({ background:'none' })`,
		},
		{
			code: `
        import { B100 } from '@atlaskit/theme/colors';
      `,
		},
		{
			code: `
        css({
          boxShadow: token('elevation.shadow.raised'),
        })
      `,
		},
		{
			code: `
        css\`
          box-shadow: \${token('elevation.shadow.raised')};
        \`
      `,
		},
		{
			code: `
        css\`
          color: inherit;
          color: token('color.blanket');
        \`
      `,
		},
		{
			code: `
      styled.div\`
        color: inherit;
        color: token('color.blanket');
      \`
    `,
		},
		{
			code: `
      const number = 123;
      const aString = number.toString();
    `,
		},
		{
			code: `
      wrapper.find('#eeeeee').exists()
      `,
		},
		// Using config -> shouldEnforceFallbacks: true
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `token('elevation.shadow.raised', background())`,
		},
		{
			code: `const background = 'hey';`,
		},
		{
			code: `import { e100 } from 'lib';`,
		},
		{
			code: `css({background:'none'})`,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `import { B100 } from '@atlaskit/theme/colors';`,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      css({
        boxShadow: token('elevation.shadow.raised', 'red'),
      })
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      css\`
        box-shadow: \${token('elevation.shadow.raised', 'red')};
      \`
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      css\`
        color: inherit;
        color: token('color.blanket', 'red');
      \`
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      styled.div\`
        color: inherit;
        color: token('color.blanket', 'red');
      \`
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      token('color.blanket', 'red');
      token('color.blanket', B100);
      token('color.blanket', colors.B200);
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      token('color.blanket', 'red');
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
      const number = 123;
      const aString = number.toString();
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
    css({
      backgroundColor: token('color.blanket', background())
    })
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
    wrapper.find('#eeeeee').exists()
    `,
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `
    const state = {
      value: 'red',
      color: 'blue',
      textColor: text(),
      bgColor: background,
    };
    `,
		},
		`const { value } = { color: 'blue' };`,
		`
    const options = [{ name: 'red', value: 'red', label: 'red' }]
    `,
		`
    const truncateCss = css\`
      white-space: nowrap;
    \`;
    `,
		`console.log(\`Removed \${text}.\`);`,
		`export const App = () => <SimpleTag text="Base Tag" testId="standard" />;`,
		`export const App = () => <Avatar src="0x400" />;`,
		// Using UNSAFE_ignoreTokens -> ['trello.color.background.accent.lime.subtle']
		{
			options: [{ UNSAFE_ignoreTokens: ['trello.color.background.accent.lime.subtle'] }],
			code: `token('trello.color.background.accent.lime.subtle')`,
		},
		{
			options: [{ fallbackUsage: 'optional' }],
			code: `token('elevation.shadow.raised')`,
		},
		{
			options: [{ fallbackUsage: 'optional' }],
			code: `token('elevation.shadow.raised', 'red')`,
		},
		{
			options: [{ fallbackUsage: 'forced' }],
			code: `token('elevation.shadow.raised', 'red')`,
		},
		{
			code: `
      styled.div\`
        font: token('font.heading.small');
      \`
    `,
		},
	],
	invalid: [
		{
			code: `css({ color: 'var(--ds-background-accent-blue-subtler)' });`,
			output: `css({ color: token('color.background.accent.blue.subtler') });`,
			errors: [{ messageId: 'directTokenUsage' }],
		},
		{
			code: `
          css\`
            color: var(--ds-background-accent-blue-subtler);
          \`;
        `,
			errors: [{ messageId: 'directTokenUsage' }],
		},
		{
			code: `
          styled.div\`
            color: var(--ds-background-accent-blue-subtler);
          \`;
        `,
			errors: [{ messageId: 'directTokenUsage' }],
		},
		{
			code: `token(identifier);`,
			errors: [{ messageId: 'staticToken' }],
		},
		{
			code: `token('dont-exist');`,
			errors: [{ message: 'The token "dont-exist" does not exist.' }],
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `css({ color: token('${oldTokenName}', fallback) })`,
			output: `css({ color: token('${newTokenName}', fallback) })`,
			errors: [{ messageId: 'tokenRemoved' }],
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `css({ color: token('${oldTokenName}', getColor()) })`,
			output: `css({ color: token('${newTokenName}', getColor()) })`,
			errors: [{ messageId: 'tokenRemoved' }],
		},
		{
			options: [{ shouldEnforceFallbacks: true }],
			code: `css({ color: token('${oldTokenName}', 'blue') })`,
			output: `css({ color: token('${newTokenName}', 'blue') })`,
			errors: [{ messageId: 'tokenRemoved' }],
		},
		{
			code: `css({ color: token('${oldTokenName}') })`,
			output: `css({ color: token('${newTokenName}') })`,
			errors: [{ messageId: 'tokenRemoved' }],
		},
		{
			// Replace experimental token with a different token
			code: `css({ color: token('${experimentalTokenName1}') })`,
			output: `css({ color: token('${experimentalTokenReplacement1}') })`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
		{
			// Replace experimental token with a raw value
			code: `css({ padding: token('${experimentalTokenName2}') })`,
			output: `css({ padding: '${experimentalTokenReplacement2}' })`,
			errors: [{ messageId: 'tokenIsExperimental' }],
		},
		{
			// should remove [default] from paths
			code: `css({ color: token('tokenName.foo.old') })`,
			output: `css({ color: token('tokenName.foo.new') })`,
			errors: [{ messageId: 'tokenRemoved' }],
		},
		// Using config -> shouldEnforceFallbacks: false
		{
			// should error when a fallback is supplied
			code: `css({ color: token('elevation.shadow.raised', 'red') })`,
			output: `css({ color: token('elevation.shadow.raised') })`,
			errors: [{ messageId: 'tokenFallbackRestricted' }],
		},
		// Using config -> shouldEnforceFallbacks: true
		{
			// should error when a fallback is not supplied
			options: [{ shouldEnforceFallbacks: true }],
			code: `css({ color: token('elevation.shadow.raised') })`,
			errors: [{ messageId: 'tokenFallbackEnforced' }],
		},
		{
			// should error when a fallback is not supplied
			options: [{ fallbackUsage: 'forced' }],
			code: `css({ color: token('elevation.shadow.raised') })`,
			errors: [{ messageId: 'tokenFallbackEnforced' }],
		},
		// should automatically insert a default fallback value
		{
			options: [{ fallbackUsage: 'forced' }],
			code: `css({ color: token('color.text') })`,
			output: `css({ color: token('color.text', '#172B4D') })`,
			errors: [{ messageId: 'tokenFallbackEnforced' }],
		},
	],
});
