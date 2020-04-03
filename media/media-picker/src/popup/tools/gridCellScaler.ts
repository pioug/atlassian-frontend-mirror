export interface ScalerInput {
  width: number;
  height: number;
  containerWidth: number;
  gapSize: number;
  numberOfColumns: number;
}

export default ({
  width,
  height,
  containerWidth,
  gapSize,
  numberOfColumns,
}: ScalerInput) => {
  const desiredWith = Math.floor(
    (containerWidth - gapSize * (numberOfColumns - 1)) / numberOfColumns,
  );

  return {
    width: desiredWith,
    height: Math.round((desiredWith / width) * height),
  };
};
