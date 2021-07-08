import React from 'react';

import { render } from '@testing-library/react';

import Lozenge from '../../../index';

describe('Lozenge', () => {
  describe('appearance property', () => {
    it('should set CSS that will truncate text when too large', () => {
      const { getByText } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );
      expect(getByText(/hello/i)).toHaveStyle(
        `
        overflowX: hidden;
        overflowY: hidden;
        textOverflow: ellipsis;
        width: 100%;
        `,
      );
    });
  });

  describe('maxWidth property', () => {
    it('should set default max width to 200px', () => {
      const { getByText } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveStyle(`max-width: 200px`);
    });

    it('should set custom numeric max width', () => {
      const { getByText } = render(
        <Lozenge appearance="new" maxWidth={120} testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveStyle(`max-width: 120px`);
    });

    it('should set custom string max width', () => {
      const { getByText } = render(
        <Lozenge appearance="new" maxWidth="99%" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveStyle(`max-width: 99%`);
    });
  });

  it('should apply styles properly', () => {
    const { getByText } = render(<Lozenge>Hello</Lozenge>);

    expect(getByText(/hello/i)).toHaveStyle(
      `  
      display: inline-block;
      verticalAlign: top;
      overflowX: hidden;
      overflowY: hidden;
      textOverflow: ellipsis;
      whiteSpace: nowrap;
      boxSizing: border-box;
      paddingTop: 0;
      paddingRight: 4px;
      paddingBottom: 0;
      paddingLeft: 4px';
      maxWidth: 200px';
      width: 100%;
    `,
    );
  });
});
