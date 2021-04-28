export { default } from './internal/components/modal-wrapper';
export { default as ModalTransition } from './internal/components/modal-transition';
export {
  Body as ModalBody,
  Header as ModalHeader,
  Footer as ModalFooter,
  Title as ModalTitle,
} from './internal/styles/content';
export type {
  BodyProps as BodyComponentProps,
  TitleTextProps as TitleComponentProps,
} from './internal/styles/content';
export type {
  KeyboardOrMouseEvent,
  AppearanceType,
  ActionProps,
  ScrollBehavior,
  ContainerComponentProps,
  ModalDialogProps,
} from './internal/types';
export type { FooterComponentProps } from './internal/components/footer';
export type { HeaderComponentProps } from './internal/components/header';
