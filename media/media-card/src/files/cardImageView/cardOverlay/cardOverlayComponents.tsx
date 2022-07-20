/**@jsx jsx */
import { jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';

import {
  altWrapperStyles,
  errorMessageStyles,
  metadataStyles,
  OverlayProps,
  overlayStyles,
  titleWrapperStyles,
} from './styles';

export const Overlay = (props: OverlayProps) => {
  const { hasError, noHover, className } = props;
  return (
    <div css={overlayStyles({ hasError, noHover })} className={className}>
      {props.children}
    </div>
  );
};

export const ErrorMessage = (props: any) => {
  return <div css={errorMessageStyles}>{props.children}</div>;
};

export const AltWrapper = (props: any) => {
  return <div css={altWrapperStyles}>{props.children}</div>;
};

export const TitleWrapper = (props: any) => {
  const theme = useGlobalTheme();
  return (
    <div css={titleWrapperStyles(theme)} className={'title'}>
      {props.children}
    </div>
  );
};

export const Metadata = (props: any) => {
  return (
    <div css={metadataStyles} className={props.className}>
      {props.children}
    </div>
  );
};
