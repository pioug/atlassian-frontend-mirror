/* eslint-disable @repo/internal/react/require-jsdoc */
import React, { createContext, type MutableRefObject } from 'react';

import { type LayerNode } from '../classes/layer-node';

export const LevelNodeContext: React.Context<React.MutableRefObject<LayerNode | null>> =
	createContext<MutableRefObject<LayerNode | null>>({
		current: null,
	});
