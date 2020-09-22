import React from 'react';

import { render } from '@testing-library/react';

import { SimpleTag, SimpleTagProps } from '../../index';

describe('Tag component', () => {
  const atlassianHref = 'https://www.atlassian.com';
  const atlassianText = 'Atlassian';
  const testProps: SimpleTagProps = {
    text: atlassianText,
    href: atlassianHref,
    testId: 'test',
  };

  describe('SimpleTag', () => {
    it('Should render simple Tag with supplied text without any removable functionality', () => {
      const { getByText, container } = render(<SimpleTag {...testProps} />);
      expect(getByText(testProps.text)).toBeTruthy();
      expect(container.querySelector('button')).toBeNull();
    });
  });
});
