// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid
import { v5 as uuidv5 } from 'uuid';

import { UUID_NAMESPACE } from './util';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid
export const getAutocompleteOptionId = (value: string): any => uuidv5(value, UUID_NAMESPACE);
