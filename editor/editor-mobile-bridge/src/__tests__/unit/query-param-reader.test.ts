import {
  getAllowCaptions,
  getAllowMediaInline,
  getRestartNumberedLists,
} from '../../query-param-reader';

describe('Query param reader', () => {
  const { location } = window;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    window.location = { search: '' } as any;
  });

  afterAll(() => {
    window.location = location;
  });
  describe('getAllowCaptions', () => {
    it('should return true if allowCaptions is true in query string', () => {
      window.location.search = 'allowCaptions=true&anotherThing=false';
      expect(getAllowCaptions()).toBeTruthy();
    });
    it('should return false if allowCaptions is not in query string', () => {
      window.location.search = 'anotherThing=false&andOneMoreThing=true';
      expect(getAllowCaptions()).toBeFalsy();
    });
    it('should return false if allowCaptions is false in query string', () => {
      window.location.search = 'allowCaptions=false&andOneMoreThing=true';
      expect(getAllowCaptions()).toBeFalsy();
    });
  });

  describe('getAllowMediaInline', () => {
    it('should return true if allowMediaInline is true in query string', () => {
      window.location.search = 'allowMediaInline=true&anotherThing=false';
      expect(getAllowMediaInline()).toBeTruthy();
    });
    it('should return false if allowMediaInline is not in query string', () => {
      window.location.search = 'anotherThing=false&andOneMoreThing=true';
      expect(getAllowMediaInline()).toBeFalsy();
    });
    it('should return false if allowMediaInline is false in query string', () => {
      window.location.search = 'allowMediaInline=false&andOneMoreThing=true';
      expect(getAllowMediaInline()).toBeFalsy();
    });
  });

  describe('getRestartNumberedLists', () => {
    it('should return true if restartNumberedLists is true in query string', () => {
      window.location.search = 'restartNumberedLists=true&anotherThing=false';
      expect(getRestartNumberedLists()).toBeTruthy();
    });
    it('should return false if restartNumberedLists is not in query string', () => {
      window.location.search = 'anotherThing=false&andOneMoreThing=true';
      expect(getRestartNumberedLists()).toBeFalsy();
    });
    it('should return false if restartNumberedLists is false in query string', () => {
      window.location.search =
        'restartNumberedLists=false&andOneMoreThing=true';
      expect(getRestartNumberedLists()).toBeFalsy();
    });
  });
});
