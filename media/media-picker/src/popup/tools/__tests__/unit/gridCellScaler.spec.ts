import scaler from '../../gridCellScaler';
import { ScalerInput } from '../../gridCellScaler';

describe('Grid Cell Scaler', () => {
  it('should scale down dimensions without a gap', () => {
    const input: ScalerInput = {
      height: 150,
      width: 150,
      containerWidth: 500,
      numberOfColumns: 5,
      gapSize: 0,
    };

    expect(scaler(input)).toEqual({
      width: 100,
      height: 100,
    });
  });

  it('should scale down dimensions with a gap', () => {
    const input: ScalerInput = {
      height: 150,
      width: 150,
      containerWidth: 500,
      numberOfColumns: 5,
      gapSize: 10,
    };

    expect(scaler(input)).toEqual({
      width: 92,
      height: 92,
    });
  });

  it('should keep image dimentions intact', () => {
    const input: ScalerInput = {
      height: 300,
      width: 150,
      containerWidth: 500,
      numberOfColumns: 5,
      gapSize: 0,
    };

    expect(scaler(input)).toEqual({
      width: 100,
      height: 200,
    });
  });
});
