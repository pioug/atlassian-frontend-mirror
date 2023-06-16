import type { AttributeSchema, ShapeTokenSchema } from '../../../types';

const shape: AttributeSchema<ShapeTokenSchema> = {
  border: {
    width: {
      '[default]': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.5.2',
          description: 'The default border width.',
        },
      },
      '0': {
        attributes: {
          group: 'shape',
          state: 'experimental',
          introduced: '1.2.1',
          description: 'Experimental, description needs to be amended',
        },
      },
      '050': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for all borders and dividers.',
        },
      },
      '100': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for bolder dividers and interaction states.',
        },
      },
    },
    radius: {
      '[default]': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.5.2',
          description: 'The default border radius.',
        },
      },
      '050': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for selection indicators, like tabs.',
        },
      },
      '100': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for buttons and inputs.',
        },
      },
      '200': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for smaller cards.',
        },
      },
      '300': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for cards and larger containers.',
        },
      },
      '400': {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for modals.',
        },
      },
      circle: {
        attributes: {
          group: 'shape',
          state: 'active',
          introduced: '1.1.0',
          description: 'Used for circular containers, like a rounded button.',
        },
      },
    },
  },
};
export default shape;
