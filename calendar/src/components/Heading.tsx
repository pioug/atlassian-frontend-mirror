import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { N70 } from '@atlaskit/theme/colors';
import React from 'react';
import styled from 'styled-components';
import Btn from './Btn';

import { Heading, MonthAndYear } from '../styled/Heading';

type Props = {
  monthLongTitle: string;
  year: number;
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
  testId?: string;
};

const ArrowLeft = styled.div`
  margin-left: 8px;
`;
const ArrowRight = styled.div`
  margin-right: 8px;
`;

export default (props: Props) => (
  <Heading aria-hidden="true">
    <ArrowLeft>
      <Btn
        onClick={props.handleClickPrev}
        testId={props.testId && `${props.testId}--previous-month`}
      >
        <ArrowleftIcon label="Last month" size="medium" primaryColor={N70} />
      </Btn>
    </ArrowLeft>
    <MonthAndYear
      data-testid={props.testId && `${props.testId}--current-month-year`}
    >
      {`${props.monthLongTitle} ${props.year}`}
    </MonthAndYear>
    <ArrowRight>
      <Btn
        onClick={props.handleClickNext}
        testId={props.testId && `${props.testId}--next-month`}
      >
        <ArrowrightIcon label="Next month" size="medium" primaryColor={N70} />
      </Btn>
    </ArrowRight>
  </Heading>
);
