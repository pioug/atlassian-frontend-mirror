import React from 'react';

import { type SmartLinkModalAPI } from './types';

const FALLBACK_API = { open: () => {}, close: () => {} };

export const SmartLinkModalContext: React.Context<SmartLinkModalAPI> =
	React.createContext<SmartLinkModalAPI>(FALLBACK_API);
