const resetOptionsInGroup = (group: { [key: string]: boolean | undefined }) => {
  return Object.keys(group || {}).reduce(
    (accumulator, current) => ({
      ...accumulator,
      [current]: typeof group[current] === 'undefined' ? undefined : false,
    }),
    {},
  );
};

export default resetOptionsInGroup;
