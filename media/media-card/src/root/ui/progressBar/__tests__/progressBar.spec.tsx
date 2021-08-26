import React from 'react';
import { shallow } from 'enzyme';
import { ProgressBar } from '../progressBar';
import { Breakpoint } from '../../Breakpoint';
import { StyledBar } from '../styled';

describe('Progress Bar', () => {
  it('should render ProgressBar properly', () => {
    const progress = 0.35;
    const progressBar = shallow(
      <ProgressBar progress={progress} breakpoint={Breakpoint.SMALL} />,
    );
    const styledBar = progressBar.find(StyledBar);
    expect(styledBar).toHaveLength(1);
    expect(styledBar.props()).toMatchObject({
      progress: progress * 100,
      breakpoint: Breakpoint.SMALL,
    });
  });

  it('should normalize progress between [0,100]', () => {
    const progressA = -0.1;
    const progressBarA = shallow(<ProgressBar progress={progressA} />);
    expect(progressBarA.find(StyledBar).prop('progress')).toBe(0);

    const progressB = 1.1;
    const progressBarB = shallow(<ProgressBar progress={progressB} />);
    expect(progressBarB.find(StyledBar).prop('progress')).toBe(100);

    const progressBarC = shallow(<ProgressBar />);
    expect(progressBarC.find(StyledBar).prop('progress')).toBe(0);

    const progressD = 0.45;
    const progressBarD = shallow(<ProgressBar progress={progressD} />);
    expect(progressBarD.find(StyledBar).prop('progress')).toBe(45);
  });
});
