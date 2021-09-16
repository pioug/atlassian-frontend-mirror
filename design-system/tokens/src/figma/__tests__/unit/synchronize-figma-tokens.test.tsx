// We don't statically export these so we suppress the error.
// This is done so we can copy and paste the script to run it in Figma.
import {
  // @ts-ignore
  synchronizeFigmaTokens as sync,
  SynchronizeFigmaTokens,
} from '../../synchronize-figma-tokens';
import type { FigmaEffectStyle, FigmaPaintStyle } from '../../types';

const synchronizeFigmaTokens: SynchronizeFigmaTokens = sync;

type FigmaMockAPI = {
  getLocalPaintStyles: jest.Mock<FigmaPaintStyle[]>;
  getLocalEffectStyles: jest.Mock<FigmaEffectStyle[]>;
  createPaintStyle: jest.Mock<FigmaPaintStyle>;
  createEffectStyle: jest.Mock<FigmaEffectStyle>;
};

describe('synchronizeFigmaTokens', () => {
  let figma: FigmaMockAPI;

  beforeEach(() => {
    figma = (window as any).figma = {
      getLocalPaintStyles: jest.fn().mockReturnValue([]),
      getLocalEffectStyles: jest.fn().mockReturnValue([]),
      createPaintStyle: jest.fn(),
      createEffectStyle: jest.fn(),
    };
  });

  describe('when creating tokens', () => {
    it('should create a paint token', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: () => {},
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        'AtlassianDark/Color': {
          value: '#03040421',
          attributes: { group: 'paint', description: 'Primary text color' },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          name: 'AtlassianDark/Color',
          description: 'Primary text color',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 0.01568627450980392,
                g: 0.01568627450980392,
                r: 0.011764705882352941,
              },
              opacity: 0.13,
              type: 'SOLID',
              visible: true,
            },
          ],
        }),
      );
    });

    it('should trim token descriptions', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: () => {},
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        'AtlassianDark/Color': {
          value: '#03040421',
          attributes: {
            group: 'paint',
            description: '    Primary text color     ',
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          description: 'Primary text color',
        }),
      );
    });

    it('should trim token tagged template descriptions', () => {
      const style: FigmaPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: () => {},
      };
      figma.createPaintStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        'AtlassianDark/Color': {
          value: '#03040421',
          attributes: {
            group: 'paint',
            description: `
Primary text color
Primary text color

            `,
          },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          description: 'Primary text color\nPrimary text color',
        }),
      );
    });

    it('should create an array of paint tokens', () => {
      const styles: FigmaPaintStyle[] = [];
      figma.createPaintStyle.mockImplementation(() => {
        const style: FigmaPaintStyle = {
          name: '',
          description: '',
          paints: [],
          remove: () => {},
        };

        styles.push(style);

        return style;
      });

      synchronizeFigmaTokens('AtlassianDark', {
        'AtlassianDark/Color/BackgroundBlanket': {
          value: '#03040421',
          attributes: { group: 'paint' },
        },
        'AtlassianDark/Color/BackgroundDisabled': {
          value: '#A1BDD908',
          attributes: { group: 'paint' },
        },
        'AtlassianDark/Color/BackgroundBoldBrand': {
          value: '#579DFF',
          attributes: { group: 'paint' },
        },
      });

      expect(figma.createPaintStyle).toHaveBeenCalledTimes(3);

      expect(styles[0]).toEqual(
        expect.objectContaining({
          name: 'AtlassianDark/Color/BackgroundBlanket',
        }),
      );
      expect(styles[1]).toEqual(
        expect.objectContaining({
          name: 'AtlassianDark/Color/BackgroundDisabled',
        }),
      );
      expect(styles[2]).toEqual(
        expect.objectContaining({
          name: 'AtlassianDark/Color/BackgroundBoldBrand',
        }),
      );
    });

    it('should create an effect token', () => {
      const style: FigmaEffectStyle = {
        name: '',
        description: '',
        effects: [],
        remove: () => {},
      };

      figma.createEffectStyle.mockReturnValue(style);

      synchronizeFigmaTokens('AtlassianDark', {
        'AtlassianDark/Color': {
          value: [
            {
              radius: 1,
              offset: {
                x: 0,
                y: 0,
              },
              color: '#161A1D',
              opacity: 0.5,
            },
          ],
          attributes: { group: 'shadow' },
        },
      });

      expect(style).toEqual(
        expect.objectContaining({
          name: 'AtlassianDark/Color',
          effects: [
            {
              blendMode: 'NORMAL',
              color: {
                a: 0.5,
                b: 0.11372549019607843,
                g: 0.10196078431372549,
                r: 0.08627450980392157,
              },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
        }),
      );
    });
  });

  describe('when reassigning / removing tokens', () => {
    it('should remove paint token and reassign it to an effect token', () => {
      const removeMock = jest.fn();
      const newEffectStyle = {
        name: '',
        description: '',
        effects: [],
        remove: () => {},
      };

      figma.createEffectStyle.mockReturnValue(newEffectStyle);
      figma.getLocalPaintStyles.mockReturnValue([
        {
          name: 'foo',
          description: 'token description',
          paints: [],
          remove: () => removeMock('foo'),
        },
      ]);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: [],
          attributes: { group: 'shadow', description: 'token description' },
        },
      });

      expect(removeMock).toHaveBeenCalledWith('foo');
      expect(newEffectStyle).toEqual(expect.objectContaining({ name: 'foo' }));
    });

    it('should remove effect token and reassign it to an paint token', () => {
      const removeMock = jest.fn();
      const newPaintStyle = {
        name: '',
        description: '',
        paints: [],
        remove: () => {},
      };

      figma.createPaintStyle.mockReturnValue(newPaintStyle);
      figma.getLocalEffectStyles.mockReturnValue([
        {
          name: 'foo',
          description: 'token description',
          effects: [],
          remove: () => removeMock('foo'),
        },
      ]);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#03040421',
          attributes: { group: 'paint', description: 'token description' },
        },
      });

      expect(removeMock).toHaveBeenCalledWith('foo');
      expect(newPaintStyle).toEqual(expect.objectContaining({ name: 'foo' }));
    });
  });

  describe('when updating tokens', () => {
    it('should update a paint token', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: '',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 0.0,
                g: 0.0,
                r: 0.0,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: () => {},
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: '#03040421',
          attributes: { group: 'paint' },
        },
      });

      expect(styles[0].paints[0]).toEqual(
        expect.objectContaining({
          color: {
            b: 0.01568627450980392,
            g: 0.01568627450980392,
            r: 0.011764705882352941,
          },
        }),
      );
    });

    it('should update an effect token', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: '',
          effects: [
            {
              blendMode: 'NORMAL',
              color: {
                a: 0.5,
                b: 0.11372549019607843,
                g: 0.10196078431372549,
                r: 0.08627450980392157,
              },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
          remove: () => {},
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);

      synchronizeFigmaTokens('AtlassianDark', {
        foo: {
          value: [
            {
              radius: 1,
              offset: { x: 0, y: 0 },
              color: '#ffffff',
              opacity: 0.5,
            },
          ],
          attributes: {
            group: 'shadow',
          },
        },
      });

      expect(styles[0].effects[0]).toEqual(
        expect.objectContaining({
          color: { a: 0.5, b: 1, g: 1, r: 1 },
        }),
      );
    });
  });

  describe('when renaming tokens', () => {
    it('should rename a paint token from foo to bar', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 0.33,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: () => {},
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementationOnce(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: '#ffffff',
            attributes: { group: 'paint', description: 'token description' },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
    });

    it('should rename an effect token', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          effects: [],
          remove: () => {},
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: [],
            attributes: { group: 'shadow', description: 'token description' },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
    });

    it('should rename a paint style that has a modified value', () => {
      const styles: FigmaPaintStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          paints: [
            {
              blendMode: 'NORMAL',
              color: {
                b: 1,
                g: 1,
                r: 1,
              },
              opacity: 1,
              type: 'SOLID',
              visible: true,
            },
          ],
          remove: () => {},
        },
      ];

      figma.getLocalPaintStyles.mockReturnValue(styles);
      figma.createPaintStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: '#000000',
            attributes: { group: 'paint', description: 'token description' },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
      expect(styles[0].paints[0].color).toEqual({ b: 0, g: 0, r: 0 });
    });

    it('should rename an effect style that has a modified value', () => {
      const styles: FigmaEffectStyle[] = [
        {
          name: 'foo',
          description: 'token description',
          effects: [
            {
              blendMode: 'NORMAL',
              color: { a: 1, b: 1, g: 1, r: 1 },
              offset: { x: 0, y: 0 },
              radius: 1,
              type: 'DROP_SHADOW',
              visible: true,
            },
          ],
          remove: () => {},
        },
      ];

      figma.getLocalEffectStyles.mockReturnValue(styles);
      figma.createEffectStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });
      figma.createPaintStyle.mockImplementation(() => {
        throw new Error('This method should not be called');
      });

      synchronizeFigmaTokens(
        'AtlassianDark',
        {
          bar: {
            value: [
              {
                radius: 1,
                offset: { x: 0, y: 0 },
                color: '#000000',
                opacity: 0.5,
              },
            ],
            attributes: { group: 'shadow', description: 'token description' },
          },
        },
        {
          foo: 'bar',
        },
      );

      expect(styles[0].name).toEqual('bar');
      expect(styles[0].effects[0].color).toEqual({ a: 0.5, b: 0, g: 0, r: 0 });
    });
  });
});
