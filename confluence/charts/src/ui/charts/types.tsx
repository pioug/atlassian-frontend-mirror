export type ChartsProps = {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
  chartType: ChartTypes;
  data: any;
};

export enum ChartTypes {
  PIE = 'PIE',
  BAR = 'BAR',
  LINE = 'LINE',
}
