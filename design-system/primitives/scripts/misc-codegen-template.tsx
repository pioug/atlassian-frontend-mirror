import { readFileSync } from 'fs';
import { join } from 'path';

export const createStylesFromFileTemplate = (
  property:
    | 'align-self'
    | 'border-color'
    | 'border-radius'
    | 'border-style'
    | 'border-width'
    | 'dimensions'
    | 'display'
    | 'flex-grow'
    | 'flex-shrink'
    | 'flex'
    | 'layer'
    | 'overflow'
    | 'position',
) => {
  const path = join(__dirname, './codegen-file-templates', `${property}.tsx`);
  const source = readFileSync(path);
  return source;
};
