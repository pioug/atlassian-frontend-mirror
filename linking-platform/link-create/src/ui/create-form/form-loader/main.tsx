/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Spinner, { SpinnerProps } from '@atlaskit/spinner';

import { CREATE_FORM_MIN_HEIGHT_IN_PX } from '../../../common/constants';

const formLoaderStyles = css({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  minHeight: `${CREATE_FORM_MIN_HEIGHT_IN_PX}px`,
});

export function CreateFormLoader({ size = 'large' }: Partial<SpinnerProps>) {
  return (
    <div css={formLoaderStyles}>
      <Spinner
        size={size}
        interactionName="load"
        testId="link-create-form-loader"
      />
    </div>
  );
}
