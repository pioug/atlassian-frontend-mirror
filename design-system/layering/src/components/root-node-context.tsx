/* eslint-disable @repo/internal/react/require-jsdoc */
import React, { createContext, type MutableRefObject } from 'react';

import { type LayerNode } from '../classes/layer-node';

export const RootNodeContext: React.Context<React.MutableRefObject<LayerNode | null>> =
	createContext<MutableRefObject<LayerNode | null>>({
		current: null,
	});
