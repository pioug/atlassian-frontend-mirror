export interface Group {
  /**
   * A label to display for the Group
   */
  label: string;

  /**
   * An icon to display for the Group
   */
  icon: string;

  /**
   * A unique key for the Group
   */
  key: string;
}

export interface GroupSelectProps {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;

  /**
   * Available groups to display
   */
  groups: Group[];
}
