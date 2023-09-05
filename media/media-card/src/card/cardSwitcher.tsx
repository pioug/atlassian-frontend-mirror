import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import CardLoader from './cardLoader';
import CardV2Loader from './v2/cardV2Loader';

export default getBooleanFF('platform.media-experience.cardv2_7zann')
  ? CardV2Loader
  : CardLoader;
