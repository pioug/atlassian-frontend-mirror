/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';

/**
 * @deprecated Use `import Mention from '@atlaskit/mention/mention'` instead.
 */
export {
	// Components
	Mention,
	ResourcedMention,
};
