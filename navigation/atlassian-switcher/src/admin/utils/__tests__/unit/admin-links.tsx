import { getAdministrationLinks } from '../../admin-links';

describe('admin-links', () => {
  describe('getAdministrationLinks', () => {
    it('should assemble admin links for site admins', () => {
      const result = getAdministrationLinks();
      const expectedResult = [`/admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
  });
});
