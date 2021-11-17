import { isSafeUrl } from '@atlaskit/adf-schema';

export const validatorFnMap: {
  [key: string]: (value: string) => boolean;
} = {
  safeUrl: isSafeUrl,
};
