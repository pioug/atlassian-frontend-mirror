import CategoryTracker from '../../../../components/picker/CategoryTracker';

describe('CategoryTracker', () => {
  describe('getRow', () => {
    it('returns undefined if the category was not added', () => {
      const tracker = new CategoryTracker();
      expect(tracker.getRow('CUSTOM')).toEqual(undefined);
    });

    it('maps a category to the first row added', () => {
      const tracker = new CategoryTracker();
      tracker.add('CUSTOM', 200);
      tracker.add('CUSTOM', 100);
      expect(tracker.getRow('CUSTOM')).toEqual(200);
    });
  });
});
