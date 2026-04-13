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
    background-color: ${'#DFE1E6'};
    color: ${'#42526E'};
  }
  .ak-lozenge__appearance-default-bold {
    background-color: ${'#42526E'};
    color: ${'#FFFFFF'};
  }
  .ak-lozenge__appearance-inprogress {
    background-color: ${'#DEEBFF'};
    color: ${'#0747A6'};
  }
  .ak-lozenge__appearance-inprogress-bold {
    background-color: ${'#0052CC'};
    color: ${'#FFFFFF'};
  }
  .ak-lozenge__appearance-moved {
    background-color: ${'#FFF0B3'};
    color: ${'#172B4D'};
  }
  .ak-lozenge__appearance-moved-bold {
    background-color: ${'#FF8B00'};
    color: ${'#172B4D'};
  }
  .ak-lozenge__appearance-new {
    background-color: ${'#EAE6FF'};
    color: ${'#403294'};
  }
  .ak-lozenge__appearance-new-bold {
    background-color: ${'#5243AA'};
    color: ${'#FFFFFF'};
  }
  .ak-lozenge__appearance-removed {
    background-color: ${'#FFEBE6'};
    color: ${'#BF2600'};
  }
  .ak-lozenge__appearance-removed-bold {
    background-color: ${'#DE350B'};
    color: ${'#FFFFFF'};
  }
  .ak-lozenge__appearance-success {
    background-color: ${'#E3FCEF'};
    color: ${'#006644'};
  }
  .ak-lozenge__appearance-success-bold {
    background-color: ${'#00875A'};
    color: ${'#FFFFFF'};
  }
`;
