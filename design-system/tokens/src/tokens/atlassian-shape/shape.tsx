import type { ShapeTokenSchema, ValueSchema } from '../../types';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/shape/shape.tsx'
 */
const shape: ValueSchema<ShapeTokenSchema> = {
  border: {
    width: {
      '[default]': { value: 'Size050' },
      '0': { value: 'Size0' },
      outline: { value: 'Size100' },
      indicator: { value: 'Size200' },
    },
    radius: {
      '[default]': { value: 'Radius100' },
      '050': { value: 'Radius050' },
      '100': { value: 'Radius100' },
      '200': { value: 'Radius200' },
      '300': { value: 'Radius300' },
      '400': { value: 'Radius400' },
      circle: { value: 'RadiusCircle' },
    },
  },
};

export default shape;
