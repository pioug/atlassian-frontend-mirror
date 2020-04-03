import { md, code } from '@atlaskit/docs';

export default md`
# Autoformatting Provider

The custom autoformatting provider lets you specify your own function that triggers on particular regex strings, and asynchronously replace them with some content. More precisely, it returns a Promise containing ADF to replace the trigger text with.

See [Editor RFC 131: Injectable auto-formatting rules, AutoformattingProvider](https://product-fabric.atlassian.net/wiki/spaces/E/pages/881141566/Editor+RFC+131+Injectable+auto-formatting+rules+AutoformattingProvider) for context, use-cases, and some more detail on how this works.

## Example

An example provider is used in the storybook example. Try typing "ED-123"!

## Usage

### Storybook Example

The provider used in the storybook example is exported from the \`@atlaskit/editor-test-helpers\` package. You probably want to use this as a base to build a more full-featured resolver.

### Simplified Example

A stripped back example might look like:

${code`export const autoformattingProvider: AutoformattingProvider = {
  getRules: () =>
    Promise.resolve({
      '[Ee][Dd]-(\\d+)': (match: string[]): Promise<ADFEntity> => {
        const ticketNumber = match[1];
        return new Promise.resolve({
          type: 'inlineCard',
          attrs: {
            url: 'https://www.atlassian.com/',
          },
        });
      },
    }),
};
`}

## Restrictions

At the moment, only text or \`inlineCard\` ADF nodes are permitted to be replaced.
`;
