import React from 'react';
import { mount } from 'enzyme';
import UnknownIcon from '@atlaskit/icon/glyph/media-services/unknown';
import { MediaTypeIcon } from '../../../newgen/media-type-icon';

describe('MediaTypeIcon', () => {
  it('MSW-741: should render the unknown icon for unexpected media types', () => {
    const el = mount(<MediaTypeIcon type={'unexpected-type' as any} />);
    expect(el.find(UnknownIcon)).toHaveLength(1);
  });
});
