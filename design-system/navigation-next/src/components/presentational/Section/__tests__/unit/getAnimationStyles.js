import getAnimationStyles from '../../getAnimationStyles';

const commonTransitionalEnteringStyles = {
  state: 'entering',
  traversalDirection: 'up',
};

const commonTransitionalExitingStyles = {
  state: 'exiting',
  traversalDirection: 'up',
};

describe('Navigation Next: getAnimationStyles', () => {
  it('should return the base styles if is state or traversal direction is NOT valid', () => {
    expect(
      getAnimationStyles({ state: 'entered', traversalDirection: 'up' }),
    ).toMatchObject({});

    expect(
      getAnimationStyles({ state: 'entering', traversalDirection: null }),
    ).toMatchObject({});
  });

  describe('When state is `entering`', () => {
    it('should add different animations based on traversal direction', () => {
      const down = getAnimationStyles({
        ...commonTransitionalEnteringStyles,
        traversalDirection: 'down',
      });
      const up = getAnimationStyles(commonTransitionalEnteringStyles);
      expect(up.styles !== down.styles).toBe(true);
    });

    it('should add the specific styles for the animation', () => {
      expect(
        getAnimationStyles(commonTransitionalEnteringStyles).styles,
      ).toContain('position:absolute');
      expect(
        getAnimationStyles(commonTransitionalEnteringStyles).styles,
      ).toContain('width:100%');
    });
  });

  describe('When state is `exiting`', () => {
    it('should add different animations based on traversal direction', () => {
      const down = getAnimationStyles({
        ...commonTransitionalExitingStyles,
        traversalDirection: 'down',
      });
      const up = getAnimationStyles(commonTransitionalExitingStyles);

      expect(up.styles !== down.styles).toBe(true);
    });
  });
});
