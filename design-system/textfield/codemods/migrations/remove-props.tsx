import { createRemoveFuncFor } from './utils';

const component = '@atlaskit/textfield';
const prop = 'theme';
const comment = `This file uses the @atlaskit/textfield \`theme\` prop which
has now been removed due to its poor performance characteristics. We have not replaced
theme with an equivalent API due to minimal usage of the \`theme\` prop.
The appearance of TextField will have likely changed.`;

export const removeThemeProp = createRemoveFuncFor(component, prop, comment);
