/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '@atlaskit/profilecard/config'` instead.
 */

export { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../util/config';

/**
 * @deprecated Use `import { ProfileCardLazy } from '@atlaskit/profilecard/lazy-profile-card'` instead.
 */
export { ProfileCardLazy } from './lazyProfileCard';
import ProfileCardTrigger from './ProfileCardTrigger';

export default ProfileCardTrigger;
