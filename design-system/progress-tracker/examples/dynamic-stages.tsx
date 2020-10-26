import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right';

import { ProgressTracker, Stages } from '../src';

const css = `
  .steppers {
    border-bottom: 1px solid;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .container {
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .button {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

function createTrackerItems(stages: number, currentStage: number): Stages {
  let resultItems: Stages = [];
  for (let i = 0; i < stages; i++) {
    resultItems.push({
      id: i.toString(),
      percentageComplete: i < currentStage && i !== stages - 1 ? 100 : 0,
      status: i < currentStage ? 'visited' : 'unvisited',
      label: 'Stage ' + (i + 1),
    });
  }

  return resultItems;
}

const Tracker = ({
  itemsNumber,
  currentStage,
}: {
  itemsNumber: number;
  currentStage: number;
}) => {
  const trackerItems = createTrackerItems(itemsNumber, currentStage);
  return <ProgressTracker testId="tracker" items={trackerItems} />;
};
const PrevIcon = <ArrowLeftCircleIcon label="prev" />;
const NextIcon = <ArrowRightCircleIcon label="next" />;
const MAX_STAGES = 5;

export default () => {
  const [itemsNumber, setItemsNumber] = useState(3);
  const [currentStage, setCurrentStage] = useState(0);
  return (
    <>
      <style>{css}</style>
      <Tracker itemsNumber={itemsNumber} currentStage={currentStage} />
      <div className="steppers">
        <Button
          className="button"
          onClick={() => {
            setCurrentStage(0);
            setItemsNumber(3);
          }}
        >
          Reset
        </Button>
        <Button
          testId="button--prev"
          className="button"
          appearance="subtle"
          onClick={() => setCurrentStage(Math.max(currentStage - 1, 0))}
          iconBefore={PrevIcon}
        >
          Previous Step
        </Button>
        <Button
          testId="button--next"
          appearance="subtle"
          onClick={() =>
            setCurrentStage(Math.min(currentStage + 1, itemsNumber))
          }
          iconAfter={NextIcon}
        >
          Next Step
        </Button>
      </div>
      <div className="container">
        <Button
          testId="button--add"
          className="button"
          onClick={() => setItemsNumber(Math.min(itemsNumber + 1, MAX_STAGES))}
        >
          Add Stage
        </Button>
        <Button
          testId="button--remove"
          className="button"
          onClick={() => {
            setItemsNumber(Math.max(itemsNumber - 1, 1));
            setCurrentStage(Math.min(itemsNumber - 1, currentStage));
          }}
        >
          Remove Stage
        </Button>
      </div>
    </>
  );
};
