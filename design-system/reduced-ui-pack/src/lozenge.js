// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import evaluateInner from './utils/evaluate-inner';

const lozengeBorderRadius = '3px';

export default evaluateInner`
  .ak-lozenge {
    border-radius: ${lozengeBorderRadius};
    box-sizing: border-box;
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    max-width: 200px;
    overflow: hidden;
    padding: 2px 4px 3px 4px;
    text-transform: uppercase;
    text-overflow: ellipsis;
    vertical-align: baseline;
    white-space: nowrap;
  }
  .ak-lozenge__appearance-default {
    background-color: ${colors.N40};
    color: ${colors.N500};
  }
  .ak-lozenge__appearance-default-bold {
    background-color: ${colors.N500};
    color: ${colors.N0};
  }
  .ak-lozenge__appearance-inprogress {
    background-color: ${colors.B50};
    color: ${colors.B500};
  }
  .ak-lozenge__appearance-inprogress-bold {
    background-color: ${colors.B400};
    color: ${colors.N0};
  }
  .ak-lozenge__appearance-moved {
    background-color: ${colors.Y75};
    color: ${colors.N800};
  }
  .ak-lozenge__appearance-moved-bold {
    background-color: ${colors.Y500};
    color: ${colors.N800};
  }
  .ak-lozenge__appearance-new {
    background-color: ${colors.P50};
    color: ${colors.P500};
  }
  .ak-lozenge__appearance-new-bold {
    background-color: ${colors.P400};
    color: ${colors.N0};
  }
  .ak-lozenge__appearance-removed {
    background-color: ${colors.R50};
    color: ${colors.R500};
  }
  .ak-lozenge__appearance-removed-bold {
    background-color: ${colors.R400};
    color: ${colors.N0};
  }
  .ak-lozenge__appearance-success {
    background-color: ${colors.G50};
    color: ${colors.G500};
  }
  .ak-lozenge__appearance-success-bold {
    background-color: ${colors.G400};
    color: ${colors.N0};
  }
`;
