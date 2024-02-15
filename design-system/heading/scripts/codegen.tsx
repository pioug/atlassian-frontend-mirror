import { writeFileSync } from 'fs';
import { join } from 'path';

import prettier from 'prettier';
import parserTypeScript from 'prettier/parser-typescript';

// eslint-disable-next-line import/order
import { createPartialSignedArtifact } from '@atlassian/codegen';

// eslint-disable-next-line import/order
import { typographyAdg3 as tokens } from '@atlaskit/tokens/tokens-raw';

const constructTokenFunctionCall = (tokenName: string, fallback: string) => {
  return `token('${tokenName}', '${fallback}')`;
};

const headingTokens = tokens
  .filter(t => t.attributes.group === 'typography')
  .filter(t => t.cleanName.includes('heading'));

const removeVerbosity = (name: string): string => {
  return name.replace('font.heading.', '');
};

export const createTypographyStylesFromTemplate = () => {
  return (
    prettier.format(
      `
const headingVariantStylesMap = {
  ${headingTokens
    .map(token => {
      return `
        '${removeVerbosity(
          token.name,
        )}': css({ font: ${constructTokenFunctionCall(
        token.cleanName,
        token.value,
      )} })
      `.trim();
    })
    .join(',\n\t')}
};`,
      {
        singleQuote: true,
        trailingComma: 'all',
        parser: 'typescript',
        plugins: [parserTypeScript],
      },
    ) + `\nexport type HeadingVariant = keyof typeof headingVariantStylesMap;\n`
  );
};

const targetPath = join(__dirname, '../', 'src', 'heading.partial.tsx');

writeFileSync(
  join(__dirname, '../src/heading.partial.tsx'),
  createPartialSignedArtifact(
    createTypographyStylesFromTemplate(),
    'yarn workspace @atlaskit/heading codegen',
    {
      id: 'typography',
      absoluteFilePath: targetPath,
    },
  ),
);
