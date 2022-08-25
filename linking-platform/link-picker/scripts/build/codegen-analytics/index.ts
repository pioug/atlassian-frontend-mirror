import { createSignedArtifact } from '@af/codegen';
import { format } from 'prettier';

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

import { generateSource } from './generate-source';
import { annotateContextualAttributes } from './context';

const generateCode = () => {
  try {
    const spec = yaml.load(
      readFileSync(join(process.cwd(), 'analytics.spec.yaml'), {
        encoding: 'utf-8',
      }),
    );

    const transformedSpec = annotateContextualAttributes(spec);

    const source = format(generateSource(transformedSpec), {
      parser: 'typescript',
      singleQuote: true,
    });

    return createSignedArtifact(
      source,
      'yarn workspace @atlaskit/link-picker run codegen-analytics',
      'Generates analytics utilities from the package analytics spec yaml',
    );
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate source', error);
    process.exit();
  }
};

const artifactsDir = join(process.cwd(), 'src');

mkdirSync(artifactsDir, {
  recursive: true,
});

writeFileSync(join(artifactsDir, 'analytics.codegen.ts'), generateCode());
