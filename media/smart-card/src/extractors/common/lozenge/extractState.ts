import { JsonLd } from 'json-ld-types';
import { LinkLozenge, LinkPullRequestState } from './types';
import { VALID_STATES } from './utils';

export const extractState = (
  jsonLd: JsonLd.Data.SourceCodePullRequest,
): LinkLozenge | undefined => {
  const state = jsonLd['atlassian:state'];
  if (state) {
    if (typeof state === 'string') {
      const pullRequestState = state.toLowerCase() as LinkPullRequestState;
      return {
        text: pullRequestState,
        appearance: VALID_STATES[pullRequestState] || 'default',
      };
    } else if (state['@type'] === 'Link') {
      if (state.name) {
        return { text: state.name, appearance: 'default' };
      }
    } else if (state['@type'] === 'Object') {
      if (state.name) {
        return { text: state.name, appearance: 'default' };
      }
    }
  }
};
