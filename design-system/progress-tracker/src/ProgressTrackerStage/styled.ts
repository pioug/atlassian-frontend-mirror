import styled from 'styled-components';

import { B300 } from '@atlaskit/theme/colors';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import { spacing } from '../constants';

const halfGridSize = gridSize() / 2;
const progressBarHeight = gridSize();
const labelTopSpacing = gridSize() + 20; // Labels sit 20px from bottom of progress bar.

export const ProgressTrackerStageContainer = styled.div`
  position: relative;
  width: 100%;
`;

interface BaseStageProps {
  transitionDelay: number;
  transitionSpeed: number;
  transitionEasing?: string;
}

interface StageMarkerProps extends BaseStageProps {
  oldMarkerColor?: string;
}

export const ProgressTrackerStageMarker = styled.div<StageMarkerProps>`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -${labelTopSpacing}px);
  background-color: ${(props) => props.color};
  height: ${progressBarHeight}px;
  width: ${progressBarHeight}px;
  border-radius: ${progressBarHeight}px;

  &.fade-appear {
    opacity: 0.01;
  }

  &.fade-appear.fade-appear-active {
    opacity: 1;
    transition: opacity ${(props) => props.transitionSpeed}ms
      ${(props) => props.transitionEasing};
    transition-delay: ${(props) => props.transitionDelay}ms;
  }

  &.fade-enter {
    background-color: ${(props) => props.oldMarkerColor};
  }

  &.fade-enter.fade-enter-active {
    background-color: ${(props) => props.color};
    transition: background-color ${(props) => props.transitionSpeed}ms
      ${(props) => props.transitionEasing};
    transition-delay: ${(props) => props.transitionDelay}ms;
  }
`;

interface StageBarProps extends BaseStageProps {
  percentageComplete: number;
  oldPercentageComplete: number;
}

export const ProgressTrackerStageBar = styled.div<StageBarProps>`
  position: absolute;
  left: 50%;
  transform: translate(0, -${labelTopSpacing}px);
  background-color: ${B300};
  height: ${progressBarHeight}px;
  width: calc(
    ${(props) => props.percentageComplete}% +
      ${(props) => props.percentageComplete} / 100 *
      ${(props) => halfGridSize + spacing[props.theme.spacing]}px
  ); /* account for spacing and radius of marker */
  border-top-right-radius: ${gridSize}px;
  border-bottom-right-radius: ${gridSize}px;

  &.fade-appear {
    width: calc(
      ${(props) => props.oldPercentageComplete}% +
        ${(props) => props.oldPercentageComplete} / 100 *
        ${(props) => halfGridSize + spacing[props.theme.spacing]}px
    ); /* account for spacing and radius of marker */
  }

  &.fade-appear.fade-appear-active {
    width: calc(
      ${(props) => props.percentageComplete}% +
        ${(props) => props.percentageComplete} / 100 *
        ${(props) => halfGridSize + spacing[props.theme.spacing]}px
    ); /* account for spacing and radius of marker */
    transition: width ${(props) => props.transitionSpeed}ms
      ${(props) => props.transitionEasing};
    transition-delay: ${(props) => props.transitionDelay}ms;
  }

  &.fade-enter {
    width: calc(
      ${(props) => props.oldPercentageComplete}% +
        ${(props) => props.oldPercentageComplete} / 100 *
        ${(props) => halfGridSize + spacing[props.theme.spacing]}px
    ); /* account for spacing and radius of marker */
  }

  &.fade-enter.fade-enter-active {
    width: calc(
      ${(props) => props.percentageComplete}% +
        ${(props) => props.percentageComplete} / 100 *
        ${(props) => halfGridSize + spacing[props.theme.spacing]}px
    ); /* account for spacing and radius of marker */
    transition: width ${(props) => props.transitionSpeed}ms
      ${(props) => props.transitionEasing};
    transition-delay: ${(props) => props.transitionDelay}ms;
  }
`;

interface StageTitleProps extends BaseStageProps {
  fontweight?: string;
}

export const ProgressTrackerStageTitle = styled.div<StageTitleProps>`
  font-weight: ${(props) => props.fontweight};
  line-height: 16px;
  color: ${(props) => props.color};
  text-align: center;
  font-size: ${fontSize}px;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${labelTopSpacing}px;

  &.fade-appear {
    opacity: 0.01;
  }

  &.fade-appear.fade-appear-active {
    opacity: 1;
    transition: opacity ${(props) => props.transitionSpeed}ms
      cubic-bezier(0.2, 0, 0, 1);
  }
`;

interface ListItemProps {
  theme: { columns: number; spacing: string };
}

// Copied styles of GridColumn from @atlaskit/page
const availableColumns = (props: ListItemProps) => props.theme.columns;
const columns = (props: ListItemProps) => Math.min(availableColumns(props), 2);
const gridSpacing = (props: ListItemProps) => spacing[props.theme.spacing];

const getMaxWidthColumnRatio = (props: ListItemProps) => {
  if (columns(props) >= availableColumns(props)) {
    return '100%';
  }
  return `99.9999% / ${availableColumns(props)} * ${columns(props)}`;
};

export const ProgressTrackerListItem = styled.li<Partial<ListItemProps>>`
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 ${(props) => spacing[props.theme.spacing] / 2}px;
  word-wrap: break-word;

  max-width: calc(${getMaxWidthColumnRatio} - ${gridSpacing}px);
  min-width: calc(99.9999% / ${availableColumns} - ${gridSpacing}px);
`;
