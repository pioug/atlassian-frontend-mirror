import { type ParsedPath } from 'path';

export const getTransformPath = ({ dir, base }: ParsedPath) => `${dir}/${base}`;
