/** @jsx jsx */
import { FC } from 'react';

import { jsx } from '@emotion/react';

type TableProps = {
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * Accessible description of the table data.
   *
   * @see 'https://www.w3.org/WAI/EO/Drafts/tutorials/tables/summary/'
   */
  summary?: string;
};

/**
 * __Table__
 *
 * A primitive table container. Applies the HTML native element with no other styling.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 *
 * @primitive
 * @see https://hello.atlassian.net/wiki/spaces/DST/pages/1947062524/Dynamic+table+2.0+implementation+spec
 */
export const Table: FC<TableProps> = ({ children, testId, summary }) => {
  return (
    <table data-testid={testId}>
      {summary && <caption>{summary}</caption>}
      {children}
    </table>
  );
};
