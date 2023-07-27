/** @jsx jsx */
import React, { useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { global } from './vr-test';
import {
  LockImage as ForbiddenImageUrl,
  NotFoundImage as NotFoundImageUrl,
  UnauthorisedImage as UnauthorisedImageUrl,
} from '../../src/view/EmbedCard/constants';
import { imageForbidden, imageNotFound, imageUnauthorised } from '../images';

const styles = css`
  padding: 10px;
`;

const VRTestWrapper: React.FC = ({ children }) => {
  const onLoad = useCallback(() => {
    // Replace cdn images with local image to reduce flakiness
    // and prevent vr test pipeline to fail if cdn become unavailable
    Array.from(document.querySelectorAll('img')).forEach(
      (img: HTMLImageElement) => {
        switch (img?.src) {
          case ForbiddenImageUrl:
            img.src = imageForbidden;
            break;
          case NotFoundImageUrl:
            img.src = imageNotFound;
            break;
          case UnauthorisedImageUrl:
            img.src = imageUnauthorised;
            break;
        }
      },
    );
  }, []);

  return (
    <IntlProvider locale={'en'}>
      <div css={styles} onLoad={onLoad}>
        {global}
        {children}
      </div>
    </IntlProvider>
  );
};

export default VRTestWrapper;
