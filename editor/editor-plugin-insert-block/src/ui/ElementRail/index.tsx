import React from 'react';

import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { type InsertBlockPlugin } from '../../plugin';

/**
 * For insert menu in right rail experiment
 * - Clean up ticket ED-24801
 */
export const InsertMenuRail = ({ api }: { api?: ExtractInjectionAPI<InsertBlockPlugin> }) => {
	return <div></div>;
};
