import type React from "react";

export type RelatedLinksModalProps = {
  /* Function to be called when the modal is closed */
  onClose: () => void;
  /* Prop which controls whether the modal is shown */
  showModal: boolean;
  /* Children of modal dialog */
  children: React.ReactNode;
};
