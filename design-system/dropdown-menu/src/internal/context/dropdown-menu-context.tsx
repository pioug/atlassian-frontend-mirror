import { createContext, type RefObject } from 'react';

interface DropdownMenuContext {
	returnFocusRef: RefObject<HTMLElement> | null;
}

const DropdownMenuContext = createContext<DropdownMenuContext | undefined>(undefined);

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Dropdown menu provider__
 *
 * A dropdown menu provider {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const DropdownMenuProvider = DropdownMenuContext.Provider;
