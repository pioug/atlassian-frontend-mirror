/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { token } from '@atlaskit/tokens';

export const center = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const borderRadius: string = `
  border-radius: ${token('radius.small', '3px')};
`;

export const borderRadiusBottom: string = `
  border-bottom-left-radius: ${token('radius.small', '3px')};
  border-bottom-right-radius: ${token('radius.small', '3px')};
`;

export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

/**
 * @deprecated Use `import { ellipsis } from '@atlaskit/media-ui/ellipsis'` instead.
 */
export { ellipsis } from './ellipsis';
/**
 * @deprecated Use `import { size } from '@atlaskit/media-ui/size'` instead.
 */
export { size } from './size';
/**
 * @deprecated Use `import { absolute } from '@atlaskit/media-ui/absolute'` instead.
 */
export { absolute } from './absolute';
