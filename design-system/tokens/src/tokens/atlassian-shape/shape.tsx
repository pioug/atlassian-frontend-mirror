import type { ShapeTokenSchema, ValueSchema } from '../../types';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/shape/shape.tsx'
 */
const shape: ValueSchema<ShapeTokenSchema> = {
  border: {
    width: {
      '050': { value: 'Size050' },
      '100': { value: 'Size100' },
    },
    radius: {
      '050': { value: 'Radius050' },
      '100': { value: 'Radius100' },
      '200': { value: 'Radius200' },
      '300': { value: 'Radius300' },
      '400': { value: 'Radius400' },
      round: { value: 'RadiusCircle' },
    },
  },
};

export default shape;
