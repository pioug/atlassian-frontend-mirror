import { createRemoveFuncFor } from '../utils';

const component = '@atlaskit/calendar';
const prop = 'innerProps';
const comment = `This file uses the @atlaskit/calendar \`innerProps\` which
has now been removed due to its poor performance characteristics. Codemod
has auto flattened 'className' & 'style' properties inside it if present as a standalone props to calendar.
Rest other properties if any inside innerProps will get auto-removed along with it,
& might have to be handled manually as per need.`;

export const removeInnerProps = createRemoveFuncFor(component, prop, comment);
