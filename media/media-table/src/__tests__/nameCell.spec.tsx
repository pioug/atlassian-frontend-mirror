import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '@atlaskit/tooltip';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { NameCell } from '../component/nameCell';

describe('NameCell', () => {
  it('renders one Truncate component with correct text', async () => {
    const nameCell = shallow(<NameCell text="This is the file name.png" />);

    expect(nameCell.find(Truncate)).toHaveLength(1);
    expect(nameCell.find(Truncate).get(0).props.text).toBe(
      'This is the file name.png',
    );
  });

  it('renders one Tooltip component with correct content', async () => {
    const nameCell = shallow(<NameCell text="This is the file name.png" />);

    expect(nameCell.find(Tooltip)).toHaveLength(1);
    expect(nameCell.find(Tooltip).get(0).props.content).toBe(
      'This is the file name.png',
    );
  });

  it('renders one MediaTypeIcon component with the correct mediaType', async () => {
    const nameCell = shallow(
      <NameCell text="This is the file name.png" mediaType="image" />,
    );

    expect(nameCell.find(MediaTypeIcon)).toHaveLength(1);
    expect(nameCell.find(MediaTypeIcon).get(0).props.type).toBe('image');
  });

  it('does not render a MediaTypeIcon component when mediaType is not provided', async () => {
    const nameCell = shallow(<NameCell text="This is the file name.png" />);

    expect(nameCell.find(MediaTypeIcon)).toHaveLength(0);
  });
});
