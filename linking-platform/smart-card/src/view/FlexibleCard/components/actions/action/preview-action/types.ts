import { Icon } from '../../../../../../state/flexible-ui-context/types';
import { EmbedModalProps } from '../../../../../../view/EmbedModal/types';
import { ActionProps } from '../types';

export type PreviewActionProps = ActionProps & FlexibleEmbedProps;

export type FlexibleEmbedProps = {
  /* A download link - if it is provided, the download button will be shown */
  downloadUrl?: string;
  /* This should be the icon of the provider, which will be displayed to the left of the title */
  linkIcon?: Icon;
  /* Name of the provider, used in the link out to the document. */
  providerName?: string;
  /* URL used to load iframe */
  src?: string;
  /* The title of the document - this is displayed as a heading */
  title?: string;
  /* If you are not providing src, you should still provide a url, allowing people to access the page where the document is. */
  /* Also used for analytics. */
  url: string;
};

export interface PreviewFunctionProps extends EmbedModalProps {
  /* The id of a HTML element that will be used OR created to mount the modal from */
  popupMountPointId: string;
}
