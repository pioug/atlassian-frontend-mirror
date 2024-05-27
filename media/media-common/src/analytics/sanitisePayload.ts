import { type WithFileAttributes, type OperationalEventPayload } from './types';
import isValidId from 'uuid-validate';
import { produce } from 'immer';
type PayloadWithFileAttributes = OperationalEventPayload<
  WithFileAttributes,
  any,
  any
>;

const sanitiseFileId = (draft: PayloadWithFileAttributes) => {
  const { fileId } = draft.attributes.fileAttributes;
  draft.attributes.fileAttributes.fileId = isValidId(fileId)
    ? fileId
    : 'INVALID_FILE_ID';
};

const hasFileAttributesWithFileId = (
  payload: Object,
): payload is PayloadWithFileAttributes =>
  'attributes' in payload &&
  !!payload.attributes &&
  typeof payload.attributes === 'object' &&
  'fileAttributes' in payload.attributes &&
  !!payload.attributes.fileAttributes &&
  typeof payload.attributes.fileAttributes === 'object' &&
  'fileId' in payload.attributes.fileAttributes &&
  typeof payload.attributes.fileAttributes.fileId === 'string';

export const sanitiseAnalyticsPayload = (payload: Object) =>
  hasFileAttributesWithFileId(payload)
    ? produce(payload, sanitiseFileId)
    : payload;
