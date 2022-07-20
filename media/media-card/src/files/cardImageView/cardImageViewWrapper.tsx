/**@jsx jsx */
import { jsx } from '@emotion/react';
import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fileCardImageViewSelectedSelector,
  fileCardImageViewSelector,
} from './classnames';
import {
  playIconWrapperStyles,
  progressBarWrapperStyles,
  WrapperProps,
  wrapperStyles,
} from './styles';

export const CardImageViewWrapper = (props: WrapperProps) => {
  const {
    disableOverlay,
    selectable,
    selected,
    mediaType,
    mediaName,
    status,
    progress,
  } = props;
  const theme = useGlobalTheme();
  return (
    <div
      id="cardImageViewWrapper"
      data-testid="media-file-card-view"
      data-test-media-name={mediaName}
      data-test-status={status}
      data-test-progress={progress}
      data-test-selected={selected ? true : undefined}
      css={wrapperStyles({
        theme,
        disableOverlay,
        selectable,
        selected,
        mediaType,
      })}
      className={`${fileCardImageViewSelector} ${
        selected ? fileCardImageViewSelectedSelector : ''
      }`}
    >
      {props.children}
    </div>
  );
};

export const PlayIconWrapper = (props: any) => {
  return <div css={playIconWrapperStyles}>{props.children}</div>;
};

export const ProgressBarWrapper = (props: any) => {
  return <div css={progressBarWrapperStyles}>{props.children}</div>;
};
