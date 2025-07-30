import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';

import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import example from './content/example';
import props from './content/props';

export default md`
${(<AtlassianInternalWarning />)}

  ### Local Image Upload and Cropping

  The \`AvatarPickerDialog\` allows the user to upload or drop a local image, then pan and zoom to a desired cropped view.

  The default zoom level should fit the image within the crop area. Images smaller than the crop area are scaled up.

  The component constrains the panning and scaling of the image to ensure that only valid regions are selectable by the user.

  ### Pre-defined Avatars

  The component also allows the user to select from pre-defined avatar images. These can be provided to the component via it's \`avatars\` property.

  Pre-defined avatars are hidden when an image is chosen by the user.

  
  ### Error Handling
  
  The component will handle the following errors on the client:
  
  * Bad format - if the user uploads an image with a bad format, or drops an invalid mime type, an error will be shown
  * Image size > 10Mib - if the user uploads or drops an image greater than 10Mib in size, an error message will be shown
  
  See the \`errorMessage\` property below to set your own custom error message if required.

  ### Accessibility

  This component is designed to be fully accessible and follows WCAG guidelines:

  #### Keyboard Navigation
  * **Image Cropping**: Use arrow keys to move and position the image within the crop area
  * **Tab Navigation**: All interactive elements are accessible via keyboard
  * **Focus Management**: Clear visual focus indicators throughout the interface

  #### Screen Reader Support
  * **ARIA Labels**: Descriptive labels for all interactive elements
  * **Live Announcements**: Real-time feedback when moving images during cropping
  * **Semantic Markup**: Proper roles and structure for assistive technologies

  #### Features
  * Fully keyboard accessible image cropping and navigation
  * Screen reader announcements for image positioning
  * High contrast focus indicators
  * Logical tab order throughout the interface
  
  ### Note
  - **Client-side only** : 
  The component is currently designed to pass back a selected image or avatar. It does not use any specific APIs for storage or upload, that is currently the responsibility of the consumer. In other words you will need a solution to store the selected image or avatar.

  - **Limitations** :
  The component currently only accepts \`image/gif\`, \`image/jpeg\`, and \`image/png\` mime types. SVG is not currently not supported.
  The component only accepts images up to 10Mib.

${(
	<DocsContentTabs
		tabs={[
			{ name: 'Usage', content: example },
			{ name: 'Props', content: props },
		]}
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
