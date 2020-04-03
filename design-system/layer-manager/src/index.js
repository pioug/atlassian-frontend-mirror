export { default } from './components/LayerManager';
export { default as withContextFromProps } from './components/withContextFromProps';
export { default as withRenderTarget } from './components/withRenderTarget';
export { default as FocusLock } from './components/FocusLock';
export { default as Portal } from './components/Portal';
export {
  Gateway,
  GatewayDest,
  GatewayProvider,
  GatewayRegistry,
} from './components/gateway';

// DEPRECATED - we used to have a custom ScrollLock component but
// react-scrolllock already exists.
export { default as ScrollLock } from 'react-scrolllock';
