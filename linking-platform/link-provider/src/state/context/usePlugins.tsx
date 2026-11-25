import { useContext } from 'react';

import { SmartCardContext } from './index';
import { type LinkProviderPlugins } from './types';

const NO_PLUGINS: LinkProviderPlugins = {};

/**
 * Returns the plugins available for the nearest `SmartCardProvider`, or none without plugins.
 */
export const usePlugins = (): LinkProviderPlugins =>
	useContext(SmartCardContext)?.plugins ?? NO_PLUGINS;
