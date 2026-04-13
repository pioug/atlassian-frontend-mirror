/* eslint-disable @repo/internal/react/require-jsdoc */
import { type Context, createContext, type Dispatch, type SetStateAction } from 'react';

import noop from '@atlaskit/ds-lib/noop';

export const SetTriggerRefContext: Context<Dispatch<SetStateAction<HTMLElement | null>>> =
	createContext<Dispatch<SetStateAction<HTMLElement | null>>>(noop);
