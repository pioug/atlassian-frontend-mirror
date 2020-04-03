// Utility used to know if the integrator is using percentage values
export const isValidPercentageUnit = (value: string | number): boolean => {
  const valueString = `${value}`;

  return (
    valueString[valueString.length - 1] === '%' &&
    !isNaN(+valueString.slice(0, -1))
  );
};
