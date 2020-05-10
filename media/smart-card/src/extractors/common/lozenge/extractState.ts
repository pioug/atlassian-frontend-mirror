import { JsonLd } from 'json-ld-types';
import { LinkLozenge, LinkState } from './types';
import { VALID_STATES, OMIT_STATES } from './utils';

export const extractState = (
  jsonLd:
    | JsonLd.Data.SourceCodePullRequest
    | JsonLd.Data.Document
    | JsonLd.Data.Project,
): LinkLozenge | undefined => {
  const state = jsonLd['atlassian:state'];
  if (state) {
    if (typeof state === 'string') {
      const linkState = state.toLowerCase() as LinkState;
      if (!OMIT_STATES.includes(linkState)) {
        return {
          text: linkState,
          appearance: VALID_STATES[linkState] || 'default',
        };
      }
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
