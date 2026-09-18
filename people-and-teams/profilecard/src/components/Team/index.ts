/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// Do not export TeamProfileCard here as it will break lazy-loading for the team trigger.
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';
import TeamProfileCardTrigger from './TeamProfileCardTrigger';
/**
 * @deprecated Use `import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '@atlaskit/profilecard/config'` instead.
 */

export { DELAY_MS_HIDE, DELAY_MS_SHOW };

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export default TeamProfileCardTrigger;
