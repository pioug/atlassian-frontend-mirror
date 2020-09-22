import { defaultSchema } from '../../../../src/schema/default-schema';

describe('Default Schema', () => {
  it('should contains `typeAheadQuery` mark', function () {
    expect(defaultSchema.marks.typeAheadQuery).toBeDefined();
  });
});
