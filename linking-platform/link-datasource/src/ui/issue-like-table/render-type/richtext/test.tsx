import React from 'react';

import { render } from '@testing-library/react';

import RichTextType from './index';

describe('RichText Type', () => {
  const buildValidADF = (numberOfNodes: number) => {
    return {
      version: 1,
      type: 'doc',
      content: new Array(numberOfNodes).fill(1).map((_, idx) => ({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: `normal paragraph ${idx + 1}`,
          },
        ],
      })),
    };
  };

  it('renders rich text preview with first 2 nodes from a 3-node ADF via the renderer', async () => {
    const adfDoc = buildValidADF(3);
    const value = {
      type: 'adf',
      text: JSON.stringify(adfDoc),
    } as const;

    const { container } = render(<RichTextType value={value} />);

    expect(container.textContent).toEqual(
      'normal paragraph 1normal paragraph 2',
    );
  });

  it('renders rich text preview with first 2 nodes from a 2-node ADF via the renderer', async () => {
    const adfDoc = buildValidADF(2);
    const value = {
      type: 'adf',
      text: JSON.stringify(adfDoc),
    } as const;

    const { container } = render(<RichTextType value={value} />);

    expect(container.textContent).toEqual(
      'normal paragraph 1normal paragraph 2',
    );
  });

  it('renders rich text preview with first 1 node from a 1-node ADF via the renderer', async () => {
    const adfDoc = buildValidADF(1);
    const value = {
      type: 'adf',
      text: JSON.stringify(adfDoc),
    } as const;

    const { container } = render(<RichTextType value={value} />);

    expect(container.textContent).toEqual('normal paragraph 1');
  });

  it('renders rich text preview with no node from a 0-node ADF via the renderer', async () => {
    const adfDoc = buildValidADF(0);
    const value = {
      type: 'adf',
      text: JSON.stringify(adfDoc),
    } as const;

    const { container } = render(<RichTextType value={value} />);

    expect(container.textContent).toEqual('');
  });

  it('renders unknown node if incorrect value type is supplied', async () => {
    const adfDoc = buildValidADF(2);
    const value = {
      type: 'adfZ',
      text: JSON.stringify(adfDoc),
    } as any;

    const { container } = render(<RichTextType value={value} />);
    expect(container.innerHTML).toEqual(
      '<span data-testid="richtext-unsupported"></span>',
    );
  });

  it('blows up if invalid json supplied to text', async () => {
    const value = {
      type: 'adf',
      text: '{{{{{{{',
    } as any;

    const { container } = render(<RichTextType value={value} />);

    expect(
      container.querySelector('[data-testid="richtext-unsupported"]'),
    ).toBeInTheDocument();
  });
});
