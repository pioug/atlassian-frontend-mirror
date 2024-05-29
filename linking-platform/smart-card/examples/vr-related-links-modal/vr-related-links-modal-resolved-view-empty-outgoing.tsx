/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import VRTestWrapper from '../utils/vr-test-wrapper';
import RelatedLinksResolvedView from '../../src/view/RelatedLinksModal/views/resolved';
import { Client, Provider } from '@atlaskit/smart-card';
import {
  AtlasProject,
  ConfluenceBlogPost,
  ConfluencePage,
  JiraIssue,
  SlackMessage,
} from '../../examples-helpers/_jsonLDExamples';
import { type JsonLd } from 'json-ld-types';
import RelatedLinksBaseModal from '../../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';

const examples = {
  [ConfluenceBlogPost.data.url]: ConfluenceBlogPost,
  [ConfluencePage.data.url]: ConfluencePage,
  [AtlasProject.data.url]: AtlasProject,
  [SlackMessage.data.url]: SlackMessage,
  [JiraIssue.data.url]: JiraIssue,
};

class CustomClient extends Client {
  fetchData(url: string) {
    let response = { ...examples[url as keyof typeof examples] };
    return Promise.resolve(response as JsonLd.Response);
  }
}

export default () => (
  <VRTestWrapper
    overrideCss={css({
      height: '700px',
    })}
  >
    <Provider client={new CustomClient('staging')}>
      <RelatedLinksBaseModal onClose={() => {}} showModal={true}>
        <RelatedLinksResolvedView
          incomingLinks={[
            ConfluenceBlogPost.data.url,
            AtlasProject.data.url,
            ConfluencePage.data.url,
            SlackMessage.data.url,
            JiraIssue.data.url,
          ]}
          outgoingLinks={[]}
        />
      </RelatedLinksBaseModal>
    </Provider>
  </VRTestWrapper>
);
