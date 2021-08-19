import type { ShadowToken } from '../../../../../src/types';
import boxShadow from '../../box-shadow';

describe('palette transformer', () => {
  it('should transform values', () => {
    expect(boxShadow.type).toEqual('value');
  });

  it('should match shadow tokens', () => {
    const token: any = { attributes: { group: 'shadow' } };

    const actual = boxShadow.matcher?.(token);

    expect(actual).toEqual(true);
  });

  it('should not match other tokens', () => {
    const token: any = { attributes: { group: 'paint' } };

    const actual = boxShadow.matcher?.(token);

    expect(actual).toEqual(false);
  });

  it('should should transform a single shadow to box shadow', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [
        {
          color: 'B100',
          offset: { x: 1, y: 2 },
          opacity: 1,
          radius: 3,
        },
      ],
    };

    const actual = boxShadow.transformer({ original: token } as any);

    expect(actual).toEqual('1px 2px 3px #E9F2FF');
  });

  it('should should transform a single shadow with spread to box shadow', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [
        {
          color: 'B100',
          offset: { x: 1, y: 2 },
          opacity: 1,
          radius: 3,
          spread: 4,
        },
      ],
    };

    const actual = boxShadow.transformer({ original: token } as any);

    expect(actual).toEqual('1px 2px 3px 4px #E9F2FF');
  });

  it('should should transform a single inset shadow to box shadow', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [
        {
          color: 'B100',
          offset: { x: 1, y: 2 },
          opacity: 1,
          radius: 3,
          inset: true,
        },
      ],
    };

    const actual = boxShadow.transformer({ original: token } as any);

    expect(actual).toEqual('inset 1px 2px 3px #E9F2FF');
  });

  it('should should transform a single opaque shadow to box shadow', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [
        {
          color: 'B100',
          offset: { x: 1, y: 2 },
          opacity: 0.5,
          radius: 3,
        },
      ],
    };

    const actual = boxShadow.transformer({ original: token } as any);

    expect(actual).toEqual('1px 2px 3px #E9F2FF80');
  });

  it('should transform two shadows to a box shadow', () => {
    const token: ShadowToken = {
      attributes: { group: 'shadow' },
      value: [
        {
          color: 'B100',
          offset: { x: 1, y: 2 },
          opacity: 0.5,
          radius: 3,
        },
        {
          color: 'B500',
          offset: { x: 0, y: 0 },
          opacity: 1,
          radius: 1,
        },
      ],
    };

    const actual = boxShadow.transformer({ original: token } as any);

    expect(actual).toEqual('1px 2px 3px #E9F2FF80, 0px 0px 1px #388BFF');
  });
});
