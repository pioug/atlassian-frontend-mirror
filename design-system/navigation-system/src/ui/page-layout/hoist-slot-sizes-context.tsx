import { createContext } from 'react';

/**
 * Context for whether the slot sizes are to be hoisted to the document root.
 * It is set by consumers using a prop on the page layout `Root` element.
 */
export const DangerouslyHoistSlotSizes = createContext(false);
