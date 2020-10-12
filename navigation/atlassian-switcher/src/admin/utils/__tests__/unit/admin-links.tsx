import { getAdministrationLinks } from '../../admin-links';
import { Product } from '../../../../types';

describe('admin-links', () => {
  describe('getAdministrationLinks', () => {
    let isEmceeLinkEnabled = false;
    it('should assemble admin links for site admins', () => {
      const isAdmin = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        isAdmin,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );
      const expectedResult = [`/admin/billing/addapplication`, `/admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should assemble admin links for site trusted users', () => {
      const isAdmin = false;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        isAdmin,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );
      const expectedResult = [
        `/trusted-admin/billing/addapplication`,
        `/trusted-admin`,
      ];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should not include discover admin link if more if discover more button is enabled for all users', () => {
      const isDiscoverMoreForEveryoneEnabled = true;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );

      const expectedResult = [`administration`];
      expect(result.map(({ key }) => key)).toMatchObject(expectedResult);
    });
    it('When product is Jira & Emcee enabled, should include Jira Emcee link', () => {
      const product = Product.JIRA;
      isEmceeLinkEnabled = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
      );

      const expectedResult =
        '/plugins/servlet/ac/com.atlassian.jira.emcee/discover#!/discover?source=app_switcher';
      expect(result.map(({ href }) => href)).toContain(expectedResult);
    });
    it('When product is Confluence & Emcee enabled, should include Confluence Emcee link', () => {
      const product = Product.CONFLUENCE;
      isEmceeLinkEnabled = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
      );

      const expectedResult =
        '/wiki/plugins/servlet/ac/com.atlassian.confluence.emcee/discover#!/discover?source=app_switcher';
      expect(result.map(({ href }) => href)).toContain(expectedResult);
    });
  });
});
