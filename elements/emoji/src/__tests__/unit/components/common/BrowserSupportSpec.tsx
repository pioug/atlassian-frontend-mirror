import React from 'react';
import Emoji from '../../../../components/common/Emoji';
import { imageEmoji } from '../../_test-data';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { isIntersectionObserverSupported } from '../../../../util/browser-support';

describe('<Emoji />', () => {
  beforeAll(() => {
    (window as any).IntersectionObserver = undefined;
  });

  it('should render image when IntersectionObserver is not supported', async () => {
    const result = await render(<Emoji emoji={imageEmoji} />);
    const image = result.getByAltText(imageEmoji.shortName);
    expect(isIntersectionObserverSupported).toBeFalsy();
    expect(image).toHaveAttribute('src', 'https://path-to-image.png');
  });
});
