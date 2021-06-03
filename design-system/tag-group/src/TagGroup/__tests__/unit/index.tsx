import React from 'react';

import { render } from '@testing-library/react';

import Tag from '@atlaskit/tag';

import TagGroup from '../../index';

describe('TagGroup', () => {
  it('should export a base component', () => {
    const { getByText } = render(
      <TagGroup>
        <Tag text="test" />
      </TagGroup>,
    );
    expect(getByText('test')).toBeTruthy();
  });

  it('should render supplied tags', () => {
    const tags = ['Candy canes', 'Tiramisu', 'Gummi bears'];
    const { getByText } = render(
      <TagGroup>
        {tags.map((tagName) => (
          <Tag key={tagName} text={tagName} />
        ))}
      </TagGroup>,
    );
    tags.forEach((tagText) => {
      expect(getByText(tagText)).toBeTruthy();
    });
  });

  it('should justify to the start when alignment not set', () => {
    const { container } = render(
      <TagGroup>
        <Tag text="test" />
      </TagGroup>,
    );
    expect(container.firstChild).toHaveStyle(`justify-content: flex-start`);
  });

  it('should justify to the end when alignment is set to end', () => {
    const { container } = render(
      <TagGroup alignment="end">
        <Tag text="test" />
      </TagGroup>,
    );
    expect(container.firstChild).toHaveStyle(`justify-content: flex-end`);
  });
});
