import React from 'react';
import ReactDomServer from 'react-dom/server';
import { ImageComponent } from '../../../mediaImage/styled';

const aLazyImage = () => (
  <ImageComponent
    data-testid="media-image"
    draggable={false}
    alt={'alt'}
    loading="lazy"
    imageRef={React.createRef()}
  />
);

describe(ImageComponent, () => {
  it('Should render the loading prop', () => {
    expect(ReactDomServer.renderToString(aLazyImage())).toContain(
      `loading="lazy"`,
    );
  });
});
