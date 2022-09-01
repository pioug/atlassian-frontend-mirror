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
      const { getByTestId } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(200px - 8px)`,
      );
    });

    it('should set custom numeric max width', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth={120} testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(120px - 8px)`,
      );
    });

    it('should set custom string max width - percentage', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth="99%" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(99% - 8px)`,
      );
    });

    it('should set custom string max width - none', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth="none" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).not.toHaveStyleRule('max-width');
    });
  });

  it('should apply styles properly', () => {
    const { getByTestId } = render(
      <Lozenge testId="lozenge-hello">Hello</Lozenge>,
    );

    expect(getByTestId('lozenge-hello--text')).toHaveStyle(
      `
      whiteSpace: nowrap;
      textOverflow: ellipsis;
      overflow: hidden;
      width: 100%;
      boxSizing: border-box;
      maxWidth: 200px;
    `,
    );
  });
});
