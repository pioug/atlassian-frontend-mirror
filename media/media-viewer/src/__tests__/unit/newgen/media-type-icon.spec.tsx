import React from 'react';
import { mount } from 'enzyme';
import GenericIcon from '@atlaskit/icon-file-type/glyph/generic/24';
import ArchiveIconSmall from '@atlaskit/icon-file-type/glyph/archive/16';
import ImageIcon from '@atlaskit/icon-file-type/glyph/image/24';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';

describe('MediaTypeIcon', () => {
  it('MSW-741: should render the unknown icon for unexpected media types', () => {
    const el = mount(<MediaTypeIcon type={'unexpected-type' as any} />);
    expect(el.find(GenericIcon)).toHaveLength(1);
  });

  it('should render the small icon', () => {
    const el = mount(<MediaTypeIcon type={'archive'} size={'small'} />);
    expect(el.find(ArchiveIconSmall)).toHaveLength(1);
  });

  it('should render the large icon', () => {
    const el = mount(<MediaTypeIcon type={'image'} size={'large'} />);
    expect(el.find(ImageIcon)).toHaveLength(1);
  });
});
