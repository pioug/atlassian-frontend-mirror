import { createRef } from 'react';
import { OptionData } from '@atlaskit/user-picker';
import {
  isValidEmailUsingConfig,
  getInviteWarningType,
  showAdminNotifiedFlag,
  generateSelectZIndex,
  zIndexAddition,
  getMenuPortalTargetCurrentHTML,
} from '../../../components/utils';
import { layers } from '@atlaskit/theme';
import { ConfigResponse, ConfigResponseMode } from '../../../types';

describe('utils functions', () => {
  describe('generateSelectZIndex', () => {
    it('should generate correct z-index for Select component', () => {
      expect(generateSelectZIndex()).toBe(layers.modal() + zIndexAddition);
      expect(generateSelectZIndex(100)).toBe(100 + zIndexAddition);
    });
  });

  describe('getMenuPortalTargetCurrentHTML', () => {
    it('shoulder return null or HTML element from ref', () => {
      const ref = createRef<HTMLDivElement>();
      let refWithElement = createRef<HTMLDivElement>();
      // @ts-ignore - cannot assign read-only property
      refWithElement.current = {};
      expect(getMenuPortalTargetCurrentHTML(null)).toBe(null);
      expect(getMenuPortalTargetCurrentHTML(ref)).toBe(null);
      expect(getMenuPortalTargetCurrentHTML(refWithElement)).toBe(
        refWithElement.current,
      );
    });
  });

  describe('showAdminNotifiedFlag', () => {
    const noUsersSelected: OptionData[] = [];
    const emailUsersSelected: OptionData[] = [
      {
        type: 'email',
        id: 'chandra@atlassian.com',
        name: 'chandra@atlassian.com',
      },
    ];
    const selectedUsersWithoutEmail: OptionData[] = [
      {
        type: 'user',
        id: 'abc-123',
        name: 'Nissa',
      },
    ];
    const createConfig = (
      mode: ConfigResponseMode,
      domains?: string[],
    ): ConfigResponse => ({
      mode,
      allowedDomains: domains,
      allowComment: true,
    });

    describe.each`
      mode                          | no Users | no Emails | match Domain | do Not Match Domain
      ${undefined}                  | ${false} | ${false}  | ${false}     | ${false}
      ${'EXISTING_USERS_ONLY'}      | ${false} | ${false}  | ${true}      | ${true}
      ${'INVITE_NEEDS_APPROVAL'}    | ${false} | ${false}  | ${true}      | ${true}
      ${'ONLY_DOMAIN_BASED_INVITE'} | ${false} | ${false}  | ${false}     | ${true}
      ${'DOMAIN_BASED_INVITE'}      | ${false} | ${false}  | ${false}     | ${true}
      ${'ANYONE'}                   | ${false} | ${false}  | ${false}     | ${false}
    `('$mode', ({ mode, noUsers, noEmails, matchDomain, doNotMatchDomain }) => {
      it.each`
        options                      | domains              | expected
        ${noUsersSelected}           | ${[]}                | ${noUsers}
        ${selectedUsersWithoutEmail} | ${[]}                | ${noEmails}
        ${emailUsersSelected}        | ${['atlassian.com']} | ${matchDomain}
        ${emailUsersSelected}        | ${['trello.com']}    | ${doNotMatchDomain}
      `(
        `should return $expected for ${mode}, $domains and $options`,
        ({ options, domains, expected }) => {
          expect(
            showAdminNotifiedFlag(createConfig(mode, domains), options, false),
          ).toEqual(expected);
        },
      );
    });

    it('should return false for public links', () => {
      expect(
        showAdminNotifiedFlag(
          createConfig('EXISTING_USERS_ONLY', ['atlassian.com']),
          emailUsersSelected,
          true,
        ),
      ).toEqual(false);
    });
  });

  describe('getInviteWarningType', () => {
    const noUsersSelected: OptionData[] = [];
    const emailUsersSelected: OptionData[] = [
      {
        type: 'email',
        id: 'chandra@atlassian.com',
        name: 'chandra@atlassian.com',
      },
    ];
    const selectedUsersWithoutEmail: OptionData[] = [
      {
        type: 'user',
        id: 'abc-123',
        name: 'Nissa',
      },
    ];
    const createConfig = (
      mode: ConfigResponseMode,
      domains?: string[],
    ): ConfigResponse => ({
      mode,
      allowedDomains: domains,
      allowComment: true,
    });

    describe.each`
      mode                          | no Users | no Emails | match Domain | do Not Match Domain
      ${undefined}                  | ${null}  | ${null}   | ${null}      | ${null}
      ${'EXISTING_USERS_ONLY'}      | ${null}  | ${null}   | ${'ADMIN'}   | ${'ADMIN'}
      ${'INVITE_NEEDS_APPROVAL'}    | ${null}  | ${null}   | ${'ADMIN'}   | ${'ADMIN'}
      ${'ONLY_DOMAIN_BASED_INVITE'} | ${null}  | ${null}   | ${'DIRECT'}  | ${'ADMIN'}
      ${'DOMAIN_BASED_INVITE'}      | ${null}  | ${null}   | ${'DIRECT'}  | ${'ADMIN'}
      ${'ANYONE'}                   | ${null}  | ${null}   | ${'DIRECT'}  | ${'DIRECT'}
    `('$mode', ({ mode, noUsers, noEmails, matchDomain, doNotMatchDomain }) => {
      it.each`
        options                      | domains              | expected
        ${noUsersSelected}           | ${[]}                | ${noUsers}
        ${selectedUsersWithoutEmail} | ${[]}                | ${noEmails}
        ${emailUsersSelected}        | ${['atlassian.com']} | ${matchDomain}
        ${emailUsersSelected}        | ${['trello.com']}    | ${doNotMatchDomain}
      `(
        `should return $expected for ${mode}, $domains and $options`,
        ({ options, domains, expected }) => {
          expect(
            getInviteWarningType(createConfig(mode, domains), options, false),
          ).toEqual(expected);
        },
      );
    });

    it('should return null for public links', () => {
      expect(
        getInviteWarningType(
          createConfig('EXISTING_USERS_ONLY', ['atlassian.com']),
          emailUsersSelected,
          true,
        ),
      ).toEqual(null);
    });
  });

  describe('isValidEmailUsingConfig', () => {
    const defaultBehavior = [
      ['INVALID', ''],
      ['INVALID', ' '],
      ['INVALID', 'abc'],
      ['INVALID', '123'],
      ['POTENTIAL', 'someEmail@'],
      ['POTENTIAL', 'someEmail@atlassian'],
      ['VALID', 'someEmail@atlassian.com'],
    ];

    const onlyDomainBasedBehavior = [
      ['INVALID', ''],
      ['INVALID', ' '],
      ['INVALID', 'abc'],
      ['INVALID', '123'],
      ['POTENTIAL', 'someEmail@'],
      ['POTENTIAL', 'someEmail@atlassian'],
      ['INVALID', 'someEmail@trello.com'],
      ['VALID', 'someEmail@atlassian.com'],
    ];
    describe.each`
      mode                          | domains              | behavior
      ${undefined}                  | ${undefined}         | ${defaultBehavior}
      ${'EXISTING_USERS_ONLY'}      | ${undefined}         | ${defaultBehavior}
      ${'INVITE_NEEDS_APPROVAL'}    | ${undefined}         | ${defaultBehavior}
      ${'ONLY_DOMAIN_BASED_INVITE'} | ${['atlassian.com']} | ${onlyDomainBasedBehavior}
      ${'DOMAIN_BASED_INVITE'}      | ${['atlassian.com']} | ${defaultBehavior}
      ${'ANYONE'}                   | ${undefined}         | ${defaultBehavior}
    `('$mode', ({ mode, domains, behavior }) => {
      const isValidEmail = isValidEmailUsingConfig({
        mode,
        allowedDomains: domains,
        allowComment: true, // doesn't change anything
      });
      test.each<[string, string]>(behavior)(
        'should return "%s" for "%s" input text',
        (expectation, inputText) => {
          expect(isValidEmail(inputText)).toEqual(expectation);
        },
      );
    });
  });
});
