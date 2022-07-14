export { extractPlatformIsSupported } from './platform/extractPlatformIsSupported';
export { extractContext, extractProvider } from './context';

export {
  extractDateCreated,
  extractDateUpdated,
  extractDateViewed,
} from './date';

export {
  extractMembers,
  extractPersonAssignedTo,
  extractPersonCreatedBy,
  extractPersonUpdatedBy,
  extractPersonFromJsonLd,
} from './person';

export { extractImage, extractPreview } from './preview';

export { extractLink, extractTitle, extractType } from './primitives';

export { extractUrlFromIconJsonLd, extractUrlFromLinkJsonLd } from './url';

export type {
  LinkPerson,
  LinkPersonUpdatedBy,
  LinkTypeUpdatedBy,
} from './person';
export type { LinkProvider } from './context';
export type { LinkTypeCreated } from './date';
export type { LinkPreview } from './preview';
