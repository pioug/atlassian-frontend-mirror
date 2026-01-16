import { code, md } from '@atlaskit/docs';

const _default_1: any = md`
  Sample data to be used in Media tests

  ## Data for Media Api Mocks

  ### File Metadata

  To create Media Api Mocks, it is convenient to have a preset of file metadata to be returned from the metadata endpoints.

  The exported object \`generateSampleFileItem\` includes a set of functions dedicated to generate file metadata for different file types and processing states.

  The returned value includes in a tuple a ResponseFileItem (return type of metadata endpoints) and a FileIdentifier that can be used to reference the file from the testing subject.

  Example:

${code`
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';

// Create metadata of an image that has successfuly been processed
const [imageResponseFileItem, imageFileIdentifier] = generateSampleFileItem.workingImgWithRemotePreview();

// Create metadata of a video that has failed processing
const [failedVideoResponseFileItem, failedVideoFileIdentifier] = generateSampleFileItem.failedVideo();

// You can inject the file items into the Media Api Mock (Sold separately)
const myMockedMediaApi = createMockedMediaApi([imageResponseFileItem, failedVideoResponseFileItem]);

export function MyExample = () => {
  // Render your mocked environment and your component in it
  return (
    <MockedMediaClientProvider mockedMediaApi={myMockedMediaApi}>
      <MyFileComponent fileIdentifier={imageFileIdentifier} />
      <MyFileComponent fileIdentifier={failedVideoFileIdentifier} />
    </MockedMediaClientProvider>
  );
}
`}
`;
export default _default_1;
