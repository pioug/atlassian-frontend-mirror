import React from 'react';
import AISummary from '..';

import { render } from '@testing-library/react';

const markdownBulletList = `
- Item 1
- Item 2
  - Item 2.1
- Item 3
`;

describe('AI Summary', () => {
  it('should not render when content is empty ', () => {
    const { queryByTestId } = render(<AISummary content={''} />);

    const aiSummary = queryByTestId('ai-summary');
    expect(aiSummary).toBeNull();
  });

  it('renders markdown bullet list correctly', () => {
    const { getByTestId } = render(<AISummary content={markdownBulletList} />);

    const aiSummary = getByTestId('ai-summary');
    expect(aiSummary).toBeVisible();

    expect(aiSummary.innerHTML.split('\n').join('')).toEqual(
      `<ul><li>Item 1</li><li>Item 2<ul><li>Item 2.1</li></ul></li><li>Item 3</li></ul>`,
    );
  });

  //TODO: Add tests for AI Icon with Popup content when it's ready
});
