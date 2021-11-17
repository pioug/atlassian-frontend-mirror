import React from 'react';

import { render } from '@testing-library/react';

import { defaultGridColumns, varColumnsNum } from '../../constants';
import { Grid, GridColumn } from '../../index';

const testId = 'grid';

describe('<Grid />', () => {
  it('should set a css variable for the number of columns', () => {
    const columns = 42;
    const { getByTestId } = render(<Grid testId={testId} columns={columns} />);

    const styles = getComputedStyle(getByTestId(testId));
    expect(styles.getPropertyValue(varColumnsNum)).toBe(columns.toString());
  });

  it('should correctly set the default number of columns', () => {
    const testId = 'grid';
    const { getByTestId } = render(<Grid testId={testId} />);

    const styles = getComputedStyle(getByTestId(testId));
    expect(styles.getPropertyValue(varColumnsNum)).toBe(
      defaultGridColumns.toString(),
    );
  });

  describe('nesting', () => {
    it('should correctly inherit from its parent GridColumn with specified medium', () => {
      const testId = 'grid';
      const medium = 5;

      const { getByTestId } = render(
        <Grid>
          <GridColumn medium={medium}>
            <Grid testId={testId} />
          </GridColumn>
        </Grid>,
      );

      const styles = getComputedStyle(getByTestId(testId));
      expect(styles.getPropertyValue(varColumnsNum)).toBe(medium.toString());
    });

    it('should use the default number of columns if its parent GridColumn has no specified medium', () => {
      const testId = 'grid';
      const columns = 5;

      const { getByTestId } = render(
        <Grid columns={columns}>
          <GridColumn>
            <Grid testId={testId} />
          </GridColumn>
        </Grid>,
      );

      const styles = getComputedStyle(getByTestId(testId));
      expect(styles.getPropertyValue(varColumnsNum)).toBe(
        defaultGridColumns.toString(),
      );
    });
  });
});
