import { getAdministrationLinks } from '../../admin-links';

describe('admin-links', () => {
  describe('getAdministrationLinks', () => {
    it('should assemble admin links for site admins', () => {
      const isAdmin = true;
      const result = getAdministrationLinks(isAdmin);
      const expectedResult = [`/admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should assemble admin links for site trusted users', () => {
      const isAdmin = false;
      const result = getAdministrationLinks(isAdmin);
      const expectedResult = [`/trusted-admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
  });
});
