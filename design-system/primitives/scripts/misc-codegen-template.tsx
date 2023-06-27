import { readFileSync } from 'fs';
import { join } from 'path';

export const createStylesFromFileTemplate = (
  property:
    | 'border-color'
    | 'border-radius'
    | 'border-width'
    | 'dimensions'
    | 'layer',
) => {
  const path = join(__dirname, './codegen-file-templates', `${property}.tsx`);
  const source = readFileSync(path);
  return source;
};
