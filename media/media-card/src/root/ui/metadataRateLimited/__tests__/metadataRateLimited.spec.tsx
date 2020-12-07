import React from 'react';
import { shallow } from 'enzyme';
import { MetadataRateLimited } from '../metadataRateLimited';
import { Breakpoint } from '../../common';
import { PreviewRateLimitedWrapper } from '../styled';

describe('When a card is rate limited (429 error) with metadata', () => {
  it('the creating preview text should be rendered properly', () => {
    const previewText = shallow(
      <MetadataRateLimited
        breakpoint={Breakpoint.SMALL}
        positionBottom={true}
        hasTitleBox={false}
      />,
    );
    const wrapper = previewText.find(PreviewRateLimitedWrapper);

    expect(wrapper).toHaveLength(1);
  });
});
