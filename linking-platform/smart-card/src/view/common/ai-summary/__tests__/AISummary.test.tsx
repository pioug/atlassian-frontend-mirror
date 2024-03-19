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

    expect(aiSummary.innerHTML.split('\n').join('')).toMatch(
      /<ul class=".*?"><li>Item 1<\/li><li>Item 2<ul class=".*?"><li>Item 2.1<\/li><\/ul><\/li><li>Item 3<\/li><\/ul>/i,
    );
  });

  it('renders custom component', async () => {
    const TestIcon = () => <span data-testid="test-icon" />;
    const { findByTestId } = render(
      <AISummary content="test-content" showIcon iconComponent={TestIcon} />,
    );

    const icon = await findByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  it('does not render icon by default', async () => {
    const { queryByTestId } = render(<AISummary content="test-content" />);

    const icon = await queryByTestId('ai-tooltip');
    expect(icon).not.toBeInTheDocument();
  });

  it('does not render summary icon when showIcon is false', async () => {
    const { queryByTestId } = render(
      <AISummary content="test-content" showIcon={false} />,
    );

    const icon = await queryByTestId('ai-tooltip');
    expect(icon).not.toBeInTheDocument();
  });
});
