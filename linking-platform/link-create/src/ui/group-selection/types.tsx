import { Group } from '../../common/types';

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
