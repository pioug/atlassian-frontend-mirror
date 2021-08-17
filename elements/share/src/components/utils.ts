import {
  Email,
  EmailValidationResponse,
  isEmail,
  isValidEmail,
  OptionData,
  Value,
} from '@atlaskit/user-picker';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { layers } from '@atlaskit/theme';
import memoizeOne from 'memoize-one';
import {
  ConfigResponse,
  ConfigResponseMode,
  User,
  UserWithEmail,
} from '../types';

type InviteWarningType = 'ADMIN' | 'DIRECT' | 'NO-INVITE';

const matchAllowedDomains = memoizeOne(
  (domain: string, config: ConfigResponse | undefined) => {
    return (
      config &&
      config.allowedDomains &&
      config.allowedDomains.indexOf(domain) !== -1
    );
  },
);

/**
 * We need to generate correct zIndex, for the PopUp and for the Select inside it.
 * The PopUp's defaults to `layers.layer()` from @atlaskit/theme. But if user provides
 * a different value, we need check it, and in case of Select Portal z-index, we need to
 * top it, so it's visible in the popup.
 */

export const zIndexAddition: number = 10;

export const generateSelectZIndex = (dialogZIndex?: number): number => {
  // If user provided non-number value for zIndex, ignore and return undefined,
  // which will default to `layers.layer()` inside PopUp
  if (typeof dialogZIndex !== 'number' || !dialogZIndex) {
    return layers.modal() + zIndexAddition;
  }
  return dialogZIndex + zIndexAddition;
};

/**
 * Helper to get around TS error of property `current` not being
 * part of React's `ref` object.
 */
export const getMenuPortalTargetCurrentHTML = (
  ref?: React.Ref<HTMLDivElement>,
): HTMLDivElement | null => {
  if (!ref) {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(ref, 'current')) {
    return null;
  }
  // @ts-ignore ts(2339) - ref not having property current
  return ref.current as HTMLDivElement | null;
};

const cannotInvite = (
  config: ConfigResponse,
  userDomains: Set<string>,
): boolean => {
  for (const domain of userDomains) {
    if (!matchAllowedDomains(domain, config)) {
      return true;
    }
  }
  return false;
};

const extractDomain = (email: string) => email.replace(/^[^@]+@(.+)$/, '$1');

const removeDuplicates = (values: Set<string>, nextValue: string) =>
  values.add(nextValue);

const checkDomains = (
  config: ConfigResponse,
  selectedUsers: Email[],
): boolean => {
  const usersDomain = selectedUsers.reduce(
    (set, email) => removeDuplicates(set, extractDomain(email.id)),
    new Set<string>(),
  );
  return cannotInvite(config, usersDomain);
};

/**
 * Decides if the admin notified flag should be shown
 *
 * @param config share configuration object
 * @param selectedUsers selected users in the user picker
 * @param isPublicLink if the shared link is publicly accessible
 */
export const showAdminNotifiedFlag = (
  config: ConfigResponse | undefined,
  selectedUsers: Value,
  isPublicLink: boolean,
  disableInviteCapabilities?: boolean,
): boolean =>
  getInviteWarningType(
    config,
    selectedUsers,
    isPublicLink,
    disableInviteCapabilities,
  ) === 'ADMIN';

const extractUsersByEmail = (users: Value): Email[] => {
  if (users == null) {
    return [];
  }

  return Array.isArray(users) ? users.filter(isEmail) : [users].filter(isEmail);
};

/**
 * Returns the invite warning message type
 *
 * @param config share configuration object
 * @param selectedUsers selected users in the user picker
 * @param isPublicLink if the shared link is publicly accessible
 * @param disableInviteCapabilities if invite capabilities for share should be disabled
 */
export const getInviteWarningType = (
  config: ConfigResponse | undefined,
  selectedUsers: Value,
  isPublicLink: boolean,
  disableInviteCapabilities?: boolean,
): InviteWarningType | null => {
  if (!isPublicLink && config && selectedUsers) {
    const mode: ConfigResponseMode = config.mode;
    const selectedEmails: Email[] = extractUsersByEmail(selectedUsers);

    if (!selectedEmails.length) {
      return null;
    }

    if (disableInviteCapabilities) {
      return 'NO-INVITE';
    }

    const isDomainBasedMode =
      mode === 'ONLY_DOMAIN_BASED_INVITE' || mode === 'DOMAIN_BASED_INVITE';

    if (
      mode === 'EXISTING_USERS_ONLY' ||
      mode === 'INVITE_NEEDS_APPROVAL' ||
      (isDomainBasedMode && checkDomains(config, selectedEmails))
    ) {
      return 'ADMIN';
    } else if (
      mode === 'ANYONE' ||
      (isDomainBasedMode && !checkDomains(config, selectedEmails))
    ) {
      // https://product-fabric.atlassian.net/browse/PTC-2576
      return 'DIRECT';
    }
  }

  return null;
};

export const optionDataToUsers = (optionDataArray: OptionData[]): User[] =>
  optionDataArray.map((optionData: OptionData) => {
    switch (optionData.type) {
      case 'email':
        const user: UserWithEmail = {
          type: 'user',
          email: optionData.id,
        };
        return user;
      default:
        return {
          type: optionData.type || 'user',
          id: optionData.id,
        };
    }
  });

export const allowEmails = (config?: ConfigResponse) =>
  config && config.mode !== 'EXISTING_USERS_ONLY';

const needToCheckDomain = (config?: ConfigResponse) =>
  config && config.mode === 'ONLY_DOMAIN_BASED_INVITE';

export const isValidEmailUsingConfig = memoizeOne(
  (config: ConfigResponse | undefined) => {
    const checkDomain = needToCheckDomain(config);
    return (inputText: string): EmailValidationResponse => {
      const result = isValidEmail(inputText);
      if (
        result === 'VALID' &&
        checkDomain &&
        !matchAllowedDomains(extractDomain(inputText), config)
      ) {
        return 'INVALID';
      }
      return result;
    };
  },
);
