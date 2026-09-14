import type { ErrorFileState } from '@atlaskit/media-state/file-state';

import { type ResponseFileItem } from '../../client/media-store/types';
import type { CommonMediaClientError } from '../../models/errors/CommonMediaClientError';
import { fromCommonMediaClientError } from '../../models/errors/fromCommonMediaClientError';
import { createServerUnauthorizedError } from '../createServerUnauthorizedError';

const defaultErrorFileStateError = createServerUnauthorizedError();

export const createErrorFileState = (
	{ id }: ResponseFileItem,
	error: CommonMediaClientError = defaultErrorFileStateError,
): ErrorFileState => fromCommonMediaClientError(id, undefined, error);
