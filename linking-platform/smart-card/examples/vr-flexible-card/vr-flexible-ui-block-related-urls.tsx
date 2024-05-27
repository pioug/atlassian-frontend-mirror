/** @jsx jsx */
import { jsx } from '@emotion/react';

import { type JsonLd } from 'json-ld-types';

import {
  ConfluenceBlogPost,
  JiraIssue,
  SlackMessage,
} from '../../examples-helpers/_jsonLDExamples';
import { RelatedUrlsBlockErroredView } from '../../src/view/FlexibleCard/components/blocks/related-urls-block/errored';
import { RelatedUrlsResolvedView } from '../../src/view/FlexibleCard/components/blocks/related-urls-block/resolved';
import { RelatedUrlsBlockResolvingView } from '../../src/view/FlexibleCard/components/blocks/related-urls-block/resolving';
import VRTestWrapper from '../utils/vr-test-wrapper';

const resolvedResults = [
  ConfluenceBlogPost,
  JiraIssue,
  SlackMessage,
] as JsonLd.Response[];

export const RelatedUrlsBlockErrored = () => (
  <VRTestWrapper>
    <RelatedUrlsBlockErroredView />
  </VRTestWrapper>
);

export const RelatedUrlsResolved = () => (
  <VRTestWrapper>
    <RelatedUrlsResolvedView
      relatedUrlsResponse={{ resolvedResults }}
      initializeOpened={false}
    />
  </VRTestWrapper>
);

export const RelatedUrlsResolvedOpened = () => (
  <VRTestWrapper>
    <RelatedUrlsResolvedView
      relatedUrlsResponse={{ resolvedResults }}
      initializeOpened={true}
    />
  </VRTestWrapper>
);

export const RelatedUrlsBlockResolving = () => (
  <VRTestWrapper>
    <RelatedUrlsBlockResolvingView />
  </VRTestWrapper>
);
