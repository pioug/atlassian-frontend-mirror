import React from 'react';

import { render } from '@testing-library/react';
import { mount } from 'enzyme';

import Lozenge from '../../../index';

describe('Lozenge', () => {
  describe('isBold property', () => {
    it('should not be the default', () => {
      expect(mount(<Lozenge />).prop('isBold')).toBe(false);
    });

    it('should change when toggled', () => {
      expect(mount(<Lozenge isBold />).prop('isBold')).toBe(true);
    });
  });

  describe('appearance property', () => {
    it('should be "default" when not set', () => {
      expect(mount(<Lozenge />).prop('appearance')).toBe('default');
    });

    it('should change when set to an approved value: success', () => {
      expect(mount(<Lozenge appearance="success" />).prop('appearance')).toBe(
        'success',
      );
    });

    it('should set CSS that will truncate text when too large', () => {
      const { getByText } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText(/hello/i)).toHaveCompiledCss({
        overflowX: 'hidden',
        overflowY: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
      });
    });
  });

  describe('maxWidth property', () => {
    it('should set default max width to 200px', () => {
      const { getByText } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveCompiledCss('max-width', '200px');
    });

    it('should set custom numeric max width', () => {
      const { getByText } = render(
        <Lozenge appearance="new" maxWidth={120} testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveCompiledCss('max-width', '120px');
    });

    it('should set custom string max width', () => {
      const { getByText } = render(
        <Lozenge appearance="new" maxWidth="99%" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByText('hello world')).toHaveCompiledCss('max-width', '99%');
    });
  });

  it('should apply styles properly', () => {
    const { getByText } = render(<Lozenge>Hello</Lozenge>);

    expect(getByText(/hello/i)).toHaveCompiledCss({
      display: 'inline-block',
      verticalAlign: 'top',
      overflowX: 'hidden',
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      paddingTop: '0',
      paddingRight: '4px',
      paddingBottom: '0',
      paddingLeft: '4px',
      maxWidth: '200px',
      width: '100%',
    });
  });
});
