// This only works in a separated file so it is not included in _testUtils
// also discussed with Raja and he regards this as a special use case
// therefore, there will be no global / default mock for this
export default () => {
  jest.mock('popper.js', () => {
    // @ts-ignore requireActual property is missing from jest
    const PopperJS = jest.requireActual('popper.js');
    return class Popper {
      static placements: any = PopperJS.placements;
      constructor() {
        return {
          destroy: () => {},
          scheduleUpdate: () => {},
        };
      }
    };
  });
};
