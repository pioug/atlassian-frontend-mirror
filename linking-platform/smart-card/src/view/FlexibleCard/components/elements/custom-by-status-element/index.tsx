/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import type { SmartLinkStatus } from '../../../../../constants';
import type { ElementProps } from '../index';
import { CustomByStatusElement } from './CustomByStatusElement';

export type CustomElementProps = Prettify<
	Pick<ElementProps, 'className' | 'testId'> & {
		content?: string;
	} & Partial<Record<SmartLinkStatus, React.ReactNode>>
>;

export default CustomByStatusElement;

/**
 * @deprecated Use `import { CustomByStatusElement } from '@atlaskit/smart-card/custom-by-status-element'` instead.
 */
export { CustomByStatusElement } from './CustomByStatusElement';
