import React, { useEffect, useState } from 'react';
import { MediaType, FileState, FileIdentifier } from '@atlaskit/media-client';
import {
  FileStateFactory,
  MediaClientMockOptions,
  createIdentifier,
  createFileDetails,
  sleep,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import { Card } from '../src/root/card';
import { CardProps } from '../src';
import { CardDimensions } from '../src';
import { R500 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';

const defaultDimensions = { width: 200, height: 150 };

const speed = 1500;

type UseSimulationSettingsOpts = {
  mediaType?: MediaType;
  initialDimensions?: CardDimensions;
  mediaClientMockOptions?: MediaClientMockOptions;
};
const useSimulationSettings = ({
  mediaType,
  initialDimensions = defaultDimensions,
  mediaClientMockOptions: { getImageDelay = speed } = {},
}: UseSimulationSettingsOpts = {}) => {
  const [identifier, setIdentifier] = useState(createIdentifier());
  const [fileStateFactory] = useState(
    new FileStateFactory(identifier, {
      fileDetails: createFileDetails(identifier.id, mediaType),
      mediaClientMockOptions: { getImageDelay },
    }),
  );

  const [updateIdentifier] = useState(() => (newMediaType?: MediaType) => {
    const newId = createIdentifier();
    fileStateFactory.updateIdentifier(
      newId,
      createFileDetails(newId.id, newMediaType || mediaType),
    );
    setIdentifier(newId);
  });

  const [dimensions, resize] = useState(initialDimensions);
  return { fileStateFactory, dimensions, resize, identifier, updateIdentifier };
};

type SimulationUtils = {
  updateIdentifier: (newMediaType?: MediaType) => void;
  resize: (newDimensions: CardDimensions) => void;
};

const useRunSimulation = (
  simulation: (
    fileStateFactory: FileStateFactory,
    utils: SimulationUtils,
  ) => void,
  simulationSettings: UseSimulationSettingsOpts = {},
) => {
  const {
    identifier,
    fileStateFactory,
    dimensions,
    resize,
    updateIdentifier,
  } = useSimulationSettings(simulationSettings);

  useEffect(() => {
    simulation(fileStateFactory, { updateIdentifier, resize });
  }, [fileStateFactory, updateIdentifier, resize, simulation]);

  return {
    identifier,
    fileStateFactory,
    dimensions,
    resize,
    updateIdentifier,
  };
};

const useSubscribeToFileState = (
  identifier: FileIdentifier,
  fileStateFactory: FileStateFactory,
) => {
  const [fileState, setFileState] = useState<FileState | { status: string }>();
  useEffect(() => {
    const subsription = fileStateFactory.mediaClient.file.getFileState(
      identifier.id,
      { ...identifier },
    );
    subsription.subscribe({
      next: (filestate) => setFileState(filestate),
      error: () => setFileState({ status: 'subscription error' }),
    });
    return () => {
      subsription.unsubscribe();
    };
  }, [fileStateFactory, identifier]);
  return fileState;
};

type CreateExampleOptions = {
  simulationSettings?: UseSimulationSettingsOpts;
  description?: string;
};
const createExample = (
  title: string,
  simulation: (
    fileStateFactory: FileStateFactory,
    utils: SimulationUtils,
  ) => void,
  { simulationSettings = {}, description }: CreateExampleOptions = {},
): React.FC<Partial<CardProps>> => (props) => {
  const { identifier, fileStateFactory, dimensions } = useRunSimulation(
    simulation,
    simulationSettings,
  );
  const fileState = useSubscribeToFileState(identifier, fileStateFactory);

  return (
    <div
      style={{
        margin: 20,
        width: defaultDimensions.width * 1.2,
      }}
    >
      <h3>{title}</h3>
      <h4 style={{ marginBottom: 5 }}>
        File Status:{' '}
        <span style={{ color: R500 }}>{fileState?.status || 'unknown'}</span>
      </h4>
      <Card
        identifier={identifier}
        mediaClient={fileStateFactory.mediaClient}
        dimensions={dimensions}
        {...props}
      />
      {description && <p>{description}</p>}
    </div>
  );
};

const simulateProcessing = async (
  factory: FileStateFactory,
  suceeded: boolean = true,
) => {
  await sleep(speed);
  factory.next('processing');
  await sleep(speed);
  if (!suceeded) {
    factory.next('failed-processing');
  } else {
    factory.next('processed');
  }
};

const simulateFailedProcessing = async (factory: FileStateFactory) => {
  await sleep(speed);
  factory.next('failed-processing');
};

const simulateError = async (factory: FileStateFactory) => {
  await sleep(speed);
  factory.next('error');
};

const simulateUpload = async (
  factory: FileStateFactory,
  withLocalPreview?: boolean,
  suceeded: boolean = true,
) => {
  const chunks = 3;
  const chunkUploadDelay = 500;
  const processingTime = speed;
  await sleep(speed);
  factory.next('uploading', { withLocalPreview });

  const uploadUpTo = !suceeded ? chunks / 2 : chunks;
  for (let index = 0; index <= uploadUpTo; index++) {
    factory.next('uploading', {
      uploadProgress: index / chunks,
      withLocalPreview,
    });
    await sleep(chunkUploadDelay);
  }
  if (!suceeded) {
    factory.error(new Error('some-error'));
  }
  factory.next('processing', { withLocalPreview });
  await sleep(processingTime);
  factory.next('processed', { withLocalPreview });
};

const simulateManyCompleted = async (
  factory: FileStateFactory,
  withRemotePreview: boolean = false,
) => {
  await sleep(speed);
  factory.next('processed', { withRemotePreview });
  await sleep(speed);
  factory.next('processed', { withRemotePreview });
  await sleep(speed);
  factory.next('processed', { withRemotePreview });
};

const SucceededUploadWithoutLocalPreview = createExample(
  'Upload without local preview',
  (fileStateFactory: FileStateFactory) => {
    simulateUpload(fileStateFactory);
  },
  { simulationSettings: { mediaType: 'audio' } },
);

const SucceededUploadWithLocalPreview = createExample(
  'Upload with local preview',
  (fileStateFactory: FileStateFactory) => {
    simulateUpload(fileStateFactory, true);
  },
  { simulationSettings: { mediaType: 'video' } },
);

const FailedUploadWithLocalPreview = createExample(
  'Failed upload with local preview',
  (fileStateFactory: FileStateFactory) => {
    simulateUpload(fileStateFactory, true, false);
  },
  { simulationSettings: { mediaType: 'image' } },
);

const FailedUploadWithoutLocalPreview = createExample(
  'Failed upload without local preview',
  (fileStateFactory: FileStateFactory) => {
    simulateUpload(fileStateFactory, false, false);
  },
  { simulationSettings: { mediaType: 'doc' } },
);

const ManyProcessedWithPreview = createExample(
  'Processed with preview',
  (fileStateFactory: FileStateFactory) => {
    simulateManyCompleted(fileStateFactory, true);
  },
  { simulationSettings: { mediaType: 'image' } },
);

const ManyProcessedWithoutPreview = createExample(
  'Processed without preview',
  (fileStateFactory: FileStateFactory) => {
    simulateManyCompleted(fileStateFactory);
  },
  { simulationSettings: { mediaType: 'archive' } },
);

const FaliedProcessing = createExample(
  'Failed Processing',
  simulateFailedProcessing,
  { simulationSettings: { mediaType: 'doc' } },
);

const ErrorState = createExample('Error', simulateError, {
  simulationSettings: { mediaType: 'video' },
});

const Processing = createExample(
  'Processing Succeeded',
  (fileStateFactory: FileStateFactory) => {
    simulateProcessing(fileStateFactory);
  },
  { simulationSettings: { mediaType: 'video' } },
);

const ProcessingFailed = createExample(
  'Processing Failed',
  (fileStateFactory: FileStateFactory) => {
    simulateProcessing(fileStateFactory, false);
  },
  { simulationSettings: { mediaType: 'audio' } },
);

const EmptyDetails = createExample(
  'Empty Details',
  async (factory: FileStateFactory) => {
    const emptyDetails = {
      createdAt: 1630986510989,
    };
    await sleep(speed);
    factory.next('processing', { fileDetails: emptyDetails });
  },
  {
    description:
      'Incomplete uploads return empty file details and a processing status pending',
    simulationSettings: { mediaType: 'unknown' },
  },
);

const NewFileId = createExample(
  'Update File Id',
  async (factory: FileStateFactory, { updateIdentifier }: SimulationUtils) => {
    await sleep(speed);
    factory.next('failed-processing');
    await sleep(speed);
    updateIdentifier('doc');
    await sleep(speed);
    factory.next('processing');
    await sleep(speed);
    factory.next('processed');
  },
  {
    description:
      'First File Id: video with processing issue. Next File Id: PDF sucessfully processed',
    simulationSettings: { mediaType: 'video' },
  },
);

const Controls: React.FC<{
  onRestartClick: () => void;
  disableOverlay: boolean;
  onCheckboxChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}> = ({ onCheckboxChange, onRestartClick, disableOverlay }) => (
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

const createSection = (
  title: string,
  simulations: Array<React.ComponentType<Partial<CardProps>>>,
) => () => {
  const { key, SectionControls, cardProps } = useSectionControls();
  return (
    <>
      <h2 style={{ marginBottom: 10 }}>{title}</h2>
      <SectionControls />
      <div key={key} style={{ display: 'flex', flexWrap: 'wrap' }}>
        {simulations.map((Simulation) => (
          <Simulation {...cardProps} />
        ))}
      </div>
    </>
  );
};

const FreshLoadSection = createSection('Fresh Load', [
  ManyProcessedWithPreview,
  ManyProcessedWithoutPreview,
  FaliedProcessing,
  ErrorState,
  Processing,
  ProcessingFailed,
]);

const SpecialSection = createSection('Special Cases', [
  EmptyDetails,
  NewFileId,
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
