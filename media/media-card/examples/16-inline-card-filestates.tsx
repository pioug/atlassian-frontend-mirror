import React, { useState } from 'react';
import { token } from '@atlaskit/tokens';
import {
  SimulationSettings,
  useRunSimulation,
  simulateProcessed,
  simulateProcessing,
  simulateImmediateFailProcessing,
  simulateUpload,
  simulateError,
  simulateErrorState,
  simulateManyProcessed,
  simulateEmptyDetails,
  simulateUpdateFileId,
  StandardSimulation,
  simulateAlwaysLoading,
  simulateAlwaysProcessing,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import {
  MediaInlineCard,
  MediaInlineCardProps,
} from '../src/inline/mediaInlineCard';

import { R500 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/standard-button';

const defaultDimensions = { width: 200, height: 150 };

const createExample =
  (
    title: string,
    { simulation, description }: StandardSimulation,
    simulationSettings: SimulationSettings = {},
  ): React.FC<Partial<MediaInlineCardProps>> =>
  (props) => {
    const { identifier, fileStateFactory, fileState } = useRunSimulation(
      simulation,
      simulationSettings,
    );

    return (
      <div
        style={{
          margin: token('space.250', '20px'),
          width: defaultDimensions.width * 1.2,
        }}
      >
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        <h5 style={{ marginBottom: token('space.075', '6px') }}>
          File Status:{' '}
          <span style={{ color: token('color.text.danger', R500) }}>
            {fileState?.status || 'unknown'}
          </span>
        </h5>
        <MediaInlineCard
          identifier={identifier}
          mediaClient={fileStateFactory.mediaClient}
          {...props}
        />
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
  simulateProcessing(false),

  { mediaType: 'audio' },
);

const ErrorState = createExample('Error State', simulateErrorState(), {
  mediaType: 'video',
});

const ErrorThrown = createExample('Error Thrown', simulateError(), {
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
}> = ({ onRestartClick }) => (
  <div style={{ display: 'flex' }}>
    <Button appearance="primary" onClick={onRestartClick}>
      Restart
    </Button>
  </div>
);

const useSectionControls = () => {
  const [key, setKey] = useState(0);
  const SectionControls = () => (
    <Controls onRestartClick={() => setKey(key + 1)} />
  );
  return { SectionControls, key };
};

const createSection =
  (
    title: string,
    simulations: Array<React.ComponentType<Partial<MediaInlineCardProps>>>,
  ) =>
  () => {
    const { key, SectionControls } = useSectionControls();
    return (
      <>
        <h3 style={{ marginBottom: token('space.150', '12px') }}>{title}</h3>
        <SectionControls />
        <div key={key} style={{ display: 'flex', flexWrap: 'wrap' }}>
          {simulations.map((Simulation, index) => (
            <Simulation key={`simulation-${index}`} />
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
  ErrorThrown,
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
