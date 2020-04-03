import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  This component provides a component to select, drag and resize image avatars. It also provides a default list of predefined avatars.

  ### Local Image Upload and Cropping

  The \`AvatarPickerDialog\` allows the user to upload or drop a local image, then pan and zoom to a desired cropped view.

  The default zoom level should fit the image within the crop area. Images smaller than the crop area are scaled up.

  The component constrains the panning and scaling of the image to ensure that only valid regions are selectable by the user.

  ### Pre-defined Avatars

  The component also allows the user to select from pre-defined avatar images. These can be provided to the component via it's \`avatars\` property.

  Pre-defined avatars are hidden when an image is chosen by the user.

  ### Client-side only

  The component is currently designed to pass back a selected image or avatar. It does not use any specific APIs for storage or upload, that is currently the responsibility of the consumer. In other words you will need a solution to store the selected image or avatar.

  ### Limitations

  The component currently only accepts \`image/gif\`, \`image/jpeg\`, and \`image/png\` mime types. SVG is not currently not supported.

  The component only accepts images up to 10Mib.

  ### Error Handling

  The component will handle the following errors on the client:

  * Bad format - if the user uploads an image with a bad format, or drops an invalid mime type, an error will be shown
  * Image size > 10Mib - if the user uploads or drops an image greater than 10Mib in size, an error message will be shown

  See the \`errorMessage\` property below to set your own custom error message if required.

  ### Usage

  Below is an example of rendering an \`AvatarPickerDialog\`. The dialog should be wrapped in a \`ModalTransition\` component so it fades out when closed.

${code`
import { AvatarPickerDialog, Avatar } from '@atlaskit/media-avatar-picker';
import { ModalTransition } from '@atlaskit/modal-dialog';

const avatars: Array<Avatar> = [{ dataURI: 'some-data-uri' }];

const App = ({ isOpen }) => (
  <ModalTransition>
    {isOpen && (
      <AvatarPickerDialog
        avatars={avatars}
        onImagePicked={(selectedImage, crop) => {
          console.log(selectedImage.size, crop.x, crop.y, crop.size);
        }}
        onAvatarPicked={selectedAvatar =>
          console.log(selectedAvatar.dataURI)
        }
        onCancel={() => /* we need to close the dialog... */}
      />
    )}
  </ModalTransition>
);
`}

${(
  <Example
    Component={require('../examples/0-avatar-picker-with-source').default}
    title="Avatar Picker With Source"
    source={require('!!raw-loader!../examples/0-avatar-picker-with-source')}
  />
)}

${(
  <Props
    heading="Avatar List Props"
    props={require('!!extract-react-types-loader!../src/avatar-list')}
  />
)}

${(
  <Props
    heading="Avatar Picker Dialog Props"
    props={require('!!extract-react-types-loader!../src/avatar-picker-dialog')}
  />
)}

${(
  <Props
    heading="Predefined Avatar List Props"
    props={require('!!extract-react-types-loader!../src/predefined-avatar-list')}
  />
)}

${(
  <Props
    heading="Predefined Avatar View Props"
    props={require('!!extract-react-types-loader!../src/predefined-avatar-view')}
  />
)}
`;

// TODO: Image Cropper, Navigator, Placer have issues to propage their Props.
// There is an issue with react prop types and it will be solved in the coming weeks.

// ${(
//   <Props
//     heading = "Image Cropper Props"
//     props={require('!!extract-react-types-loader!../src/image-cropper')}
//   />
// )}

// ${(
//   <Props
//     heading = "Image Navigator Props"
//     props={require('!!extract-react-types-loader!../src/image-navigator')}
//   />
// )}

// ${(
//   <Props
//     heading = "Image Placer Props"
//     props={require('!!extract-react-types-loader!../src/image-placer')}
//   />
// )}
