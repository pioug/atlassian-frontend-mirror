import { globSync } from 'glob';

export const hasTransform = (transformPath: string): boolean => globSync(transformPath).length > 0;
