import React, { useState } from 'react';
import { token } from '@atlaskit/tokens';
import {
  type SimulationSettings,
  useRunSimulation,
  simulateProcessed,
  simulateProcessing,
  simulateImmediateFailProcessing,
  simulateUpload,
  simulateError,
  simulateManyProcessed,
  simulateEmptyDetails,
  simulateUpdateFileId,
  type StandardSimulation,
  simulateAlwaysLoading,
  simulateAlwaysProcessing,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import { Card } from '../src/card/card';
import { type CardProps } from '../src';
import { R500 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';

const defaultDimensions = { width: 200, height: 150 };

const createExample =
  (
    title: string,
    { simulation, description }: StandardSimulation,
    simulationSettings: SimulationSettings = {},
  ): React.FC<Partial<CardProps>> =>
  (props) => {
    const { identifier, fileStateFactory, fileState } = useRunSimulation(
      simulation,
      simulationSettings,
    );

    return (
      <div
        style={{
          margin: `${token('space.250', '20px')}`,
          width: defaultDimensions.width * 1.2,
        }}
      >
        <h4>{title}</h4>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <h5 style={{ marginBottom: token('space.075', '6px') }}>
          File Status:{' '}
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <span style={{ color: token('color.text.danger', R500) }}>
            {fileState?.status || 'unknown'}
          </span>
        </h5>
        <Card
          identifier={identifier}
          mediaClient={fileStateFactory.mediaClient}
          dimensions={defaultDimensions}
          {...props}
        />
        {description && <p>{description}</p>}
      </div>
    );
  };

const Processed = createExample(
  'Processed With Preview',
  simulateProcessed(true),
  {
    mediaType: 'image',
  },
);

const ProcessedNoPreview = createExample(
  'Processed Without Preview',
  simulateProcessed(),
  {
    mediaType: 'video',
  },
);

const ProcessingNoPreview = createExample(
  'Processing Succeeded Without Preview',
  simulateProcessing(true, false),
  { mediaType: 'video' },
);

const SucceededUploadWithoutLocalPreview = createExample(
  'Upload without local preview',
  simulateUpload(),
  { mediaType: 'audio' },
);

const SucceededUploadWithLocalPreview = createExample(
  'Upload with local preview',
  simulateUpload(true),
  { mediaType: 'video' },
);

const FailedUploadWithLocalPreview = createExample(
  'Failed upload with local preview',
  simulateUpload(true, false),
  { mediaType: 'image' },
);

const FailedUploadWithoutLocalPreview = createExample(
  'Failed upload without local preview',
  simulateUpload(false, false),
  { mediaType: 'doc' },
);

const ManyProcessedWithPreview = createExample(
  'Processed with preview',
  simulateManyProcessed(),
  {
    mediaType: 'image',
    // Media Client will immediately return the image, even before any file state
    mediaClientMockOptions: { hasPreview: true },
  },
);

const ManyProcessedWithoutPreview = createExample(
  'Processed without preview',
  simulateManyProcessed(false),
  { mediaType: 'archive' },
);

const FaliedProcessing = createExample(
  'Processing Failed',
  // Forcing a preview to ensure card displays the error and not the preview
  simulateProcessing(false, true),

  { mediaType: 'audio' },
);

const ErrorState = createExample('Error', simulateError(), {
  mediaType: 'video',
});

const Processing = createExample(
  'Processing Succeeded With Preview',
  simulateProcessing(),
  { mediaType: 'video' },
);

const InstantFaliedProcessing = createExample(
  'Immediate Processing Failed',
  simulateImmediateFailProcessing(),
  { mediaType: 'doc' },
);

const EmptyDetails = createExample('Empty Details', simulateEmptyDetails(), {
  mediaType: 'unknown',
});

const NewFileId = createExample('Update File Id', simulateUpdateFileId(), {
  mediaType: 'video',
});

const NeverLoaded = createExample('Never Loaded', simulateAlwaysLoading(), {
  mediaType: 'image',
});

const AlwaysProcessing = createExample(
  'Always Processing',
  simulateAlwaysProcessing(),
  {
    mediaType: 'doc',
  },
);

const Controls: React.FC<{
  onRestartClick: () => void;
  disableOverlay: boolean;
  onCheckboxChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}> = ({ onCheckboxChange, onRestartClick, disableOverlay }) => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={{ display: 'flex' }}>
    <Button appearance="primary" onClick={onRestartClick}>
      Restart
    </Button>
    <Checkbox
      value="disableOverlay"
      label="Disable overlay"
      isChecked={disableOverlay}
      onChange={onCheckboxChange}
      name="disableOverlay"
    />
  </div>
);

const useSectionControls = () => {
  const [key, setKey] = useState(0);
  const [disableOverlay, setDisableOverlay] = useState(false);
  const onCheckboxChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    setDisableOverlay(checked);
  };
  const cardProps = { disableOverlay };
  const SectionControls = () => (
    <Controls
      onRestartClick={() => setKey(key + 1)}
      disableOverlay={cardProps.disableOverlay}
      onCheckboxChange={onCheckboxChange}
    />
  );
  return { SectionControls, cardProps, key };
};

const createSection =
  (
    title: string,
    simulations: Array<React.ComponentType<Partial<CardProps>>>,
  ) =>
  () => {
    const { key, SectionControls, cardProps } = useSectionControls();
    return (
      <>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <h3 style={{ marginBottom: token('space.150', '12px') }}>{title}</h3>
        <SectionControls />
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div key={key} style={{ display: 'flex', flexWrap: 'wrap' }}>
          {simulations.map((Simulation, index) => (
            <Simulation key={`simulation-${index}`} {...cardProps} />
          ))}
        </div>
      </>
    );
  };

const FreshLoadSection = createSection('Fresh Load', [
  Processed,
  ProcessedNoPreview,
  Processing,
  ProcessingNoPreview,
  FaliedProcessing,
  InstantFaliedProcessing,
  ErrorState,
]);

const SpecialSection = createSection('Special Cases', [
  ManyProcessedWithPreview,
  ManyProcessedWithoutPreview,
  EmptyDetails,
  NewFileId,
  NeverLoaded,
  AlwaysProcessing,
]);

const UploadSection = createSection('Upload', [
  SucceededUploadWithoutLocalPreview,
  SucceededUploadWithLocalPreview,
  FailedUploadWithLocalPreview,
  FailedUploadWithoutLocalPreview,
]);

export default () => {
  return (
    <MainWrapper developmentOnly>
      <FreshLoadSection />
      <UploadSection />
      <SpecialSection />
    </MainWrapper>
  );
};
