export interface LinkCreateProps {
  /**
   * When `true` LinkCreate will appear selected.
   */
  isSelected?: boolean;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;

  /**
   * Width of LinkCreate.
   */
  width?: number;
}
