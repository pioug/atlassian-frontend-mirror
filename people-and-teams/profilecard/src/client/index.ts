/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import CachingClient from './CachingClient';
import ProfileCardClient from './ProfileCardClient';
import TeamProfileClient from './TeamProfileCardClient';
import UserProfileClient from './UserProfileCardClient';
import { modifyResponse } from './modifyResponse';

/**
 * @deprecated Use `import CachingClient from '@atlaskit/profilecard/caching-client'` instead.
 */
export { CachingClient };
/**
 * @deprecated Use `import { modifyResponse } from '@atlaskit/profilecard/modify-response'` instead.
 */
export { modifyResponse };
/**
 * @deprecated Use `import TeamProfileClient from '@atlaskit/profilecard/team-profile-card-client'` instead.
 */
export { TeamProfileClient };
/**
 * @deprecated Use `import UserProfileClient from '@atlaskit/profilecard/user-profile-card-client'` instead.
 */
export { UserProfileClient };

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export default ProfileCardClient;
