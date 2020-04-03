import { Avatar } from '../avatar-list';
import { CropProperties } from '../image-navigator';

export enum Mode {
  Cropping,
  PredefinedAvatars,
}

export interface AvatarPickerDialogProps {
  /** This property is used to provide an array of pre-defined avatars. The **Avatar** object is a simple type with a single **dataURI: string** property. For convenience, this type is exported from the **@atlassian/media-avatar-picker** module along with the **AvatarPickerDialog** component. */
  avatars: Array<Avatar>;
  /** This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set. */
  defaultSelectedAvatar?: Avatar;
  /** This property is raised when the user clicks the **Save** button and there is a pre-defined avatar selected, and no image selected. An **Avatar** object with a **dataURI** property is passed. */
  onAvatarPicked: (avatar: Avatar) => void;
  /** This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown. */
  imageSource?: string;
  /** This property is raised when the user clicks the **Save** button and there is a selected image.
   * Two arguments are passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.
   * This still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.
   */
  onImagePicked?: (file: File, crop: CropProperties) => void;
  /** This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string. */
  onImagePickedDataURI?: (dataUri: string) => void;
  /** This property is raised when the user clicks **Cancel** button.
   *  **Note** this does not close the dialog.
   * It is up to the consumer to re-render and remove the dialog from the UI.
   */
  onCancel: () => void;
  /** The title text for the dialog. The default is _Upload an avatar_. */
  title?: string;
  /** The primary button text. The default is _Save_. */
  primaryButtonText?: string;
  /** This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog). */
  errorMessage?: string;
  /** This optional property is used while the avatar is loaded. */
  isLoading?: boolean;
  /** This property decribe the text related to the Avatar. */
  predefinedAvatarsText?: string;
}

export interface AvatarPickerDialogState {
  mode: Mode;
  selectedAvatar?: Avatar;
  selectedImage?: File;
  selectedImageSource?: string;
  errorMessage?: string;
}
