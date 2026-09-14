/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { CustomElementByAccessType } from './CustomElementByAccessType';

export default CustomElementByAccessType;

/**
 * @deprecated Use `import { CustomElementByAccessType } from '@atlaskit/smart-card/custom-element-by-access-type'` instead.
 */
export {
	CustomElementByAccessType,
	CustomElementByAccessType as CustomByAccessTypeElement,
} from './CustomElementByAccessType';
export type { CustomElementByAccessTypeProps } from './CustomElementByAccessType';
/**
 * @deprecated Use `import { AccessType } from '@atlaskit/smart-card/access-type'` instead.
 */
export type { AccessType } from './AccessType';
