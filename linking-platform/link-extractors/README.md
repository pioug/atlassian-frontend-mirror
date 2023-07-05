# LinkExtractors

Functions for extracting props from JSON-LD

## Usage
`import {
  genericExtractPropsFromJSONLD
  extractPlatformIsSupported,
  extractContext,
  extractProvider,
  extractDateCreated,
  extractDateUpdated,
  extractDateViewed,
  extractMembers,
  extractPersonAssignedTo,
  extractPersonOwnedBy,
  extractPersonCreatedBy,
  extractPersonUpdatedBy,
  extractPersonFromJsonLd,
  extractImage,
  extractPreview,
  extractLink,
  extractTitle,
  extractType,
  extractUrlFromIconJsonLd,
  extractUrlFromLinkJsonLd,
} from '@atlaskit/link-extractors';`

`import type {
  LinkPerson,
  LinkProvider,
  LinkTypeCreated,
  LinkPersonUpdatedBy,
  LinkTypeUpdatedBy,
  LinkPreview,
  ExtractorFunction,
  ExtractOptions,
} from '@atlaskit/link-extractors'

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/linking-platform/link-extractors).
