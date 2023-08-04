import { createContext } from 'react';

/**
 * __Field id__
 *
 * A field id uses the context API. It provides the id of the field to message components. This links the message with the field of screenreaders.
 */
export const FieldId = createContext<string | undefined>(undefined);
