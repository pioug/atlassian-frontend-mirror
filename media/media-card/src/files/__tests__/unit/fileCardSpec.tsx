import React from 'react';
import { shallow } from 'enzyme';
import { FileDetails } from '@atlaskit/media-client';
import { FormattedMessage } from 'react-intl';
import { FileCard, FileCardImageView } from '../..';
import { toHumanReadableMediaSize } from '../../../utils';

describe('FileCard', () => {
  it('should render cardFileView with details passed through to props', function() {
    const details: FileDetails = {
      id: 'id',
      mediaType: 'image',
      mimeType: 'image/jpeg',
      name: 'some-image.jpg',
      processingStatus: 'succeeded',
      size: 123456,
      artifacts: {},
    };

    const expectedProps = {
      status: 'complete',
      dimensions: undefined,

      mediaName: details.name,
      mediaType: details.mediaType,
      fileSize: toHumanReadableMediaSize(details.size as number),
    };

    const card = shallow(<FileCard status="complete" details={details} />);

    const fileCardView = card.find(FileCardImageView);
    expect(fileCardView.length).toEqual(1);
    expect(fileCardView.props()).toMatchObject(expectedProps);
  });

  it('should render fileCardView with dataUri when passed', () => {
    const fakeDataUri: string = 'l33tdatauri';

    const details: FileDetails = {
      id: 'id',
      mediaType: 'image',
      mimeType: 'image/jpeg',
      name: 'some-image.jpg',
      processingStatus: 'succeeded',
      size: 123456,
      artifacts: {},
    };

    const card = shallow(
      <FileCard status="complete" details={details} dataURI={fakeDataUri} />,
    );

    expect(card.find(FileCardImageView).length).toEqual(1);
    expect(card.find(FileCardImageView).props().dataURI).toContain(fakeDataUri);
  });

  it('should render fileCardView with alt prop when passed', () => {
    const details: FileDetails = {
      id: 'id',
      mediaType: 'image',
      mimeType: 'image/jpeg',
      name: 'some-image.jpg',
      processingStatus: 'succeeded',
      size: 123456,
      artifacts: {},
    };

    const alt = 'this is a test';

    const card = shallow(
      <FileCard status="complete" details={details} alt={alt} />,
    );

    expect(card.find(FileCardImageView).length).toEqual(1);
    expect(card.find(FileCardImageView).props().alt).toBe(alt);
  });

  it('should pass "Failed to load" copy to "image" card view', () => {
    const card = shallow(<FileCard appearance="image" status="error" />);

    expect(
      (card.find(FileCardImageView).prop('error')! as FormattedMessage).props
        .defaultMessage,
    ).toEqual('Failed to load');
  });

  it('should pass "disableOverlay" prop to <FileCardImageView /> when appearance is "image"', () => {
    const card = shallow(
      <FileCard appearance="image" status="complete" disableOverlay={true} />,
    );

    expect(card.find(FileCardImageView).props().disableOverlay).toEqual(true);
  });

  it('should hide file size when size it is set to zero', () => {
    const details: FileDetails = {
      id: 'id',
      size: 0,
    };
    const card = shallow(<FileCard status="complete" details={details} />);

    const fileCardView = card.find(FileCardImageView);
    expect(fileCardView.props().fileSize).toEqual('');
  });

  it('should hide file size when size it is unset', () => {
    const details: FileDetails = {
      id: 'id',
    };
    const card = shallow(<FileCard status="complete" details={details} />);

    const fileCardView = card.find(FileCardImageView);
    expect(fileCardView.props().fileSize).toEqual('');
  });
});
