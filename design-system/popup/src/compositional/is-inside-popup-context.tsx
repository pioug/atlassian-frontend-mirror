import { type Context, createContext } from 'react';

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Ensure is inside popup context__
 *
 * An ensure is inside popup context {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const EnsureIsInsidePopupContext: Context<boolean> = createContext<boolean>(false);
