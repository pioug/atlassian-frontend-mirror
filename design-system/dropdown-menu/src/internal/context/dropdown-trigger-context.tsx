import { type Context, createContext } from 'react';

/**
 * Identifies elements rendered as dropdown triggers so descendants can adapt without extra trigger props.
 * When true, element is a trigger
 */
export const DropdownTriggerContext: Context<boolean> = createContext(false);
