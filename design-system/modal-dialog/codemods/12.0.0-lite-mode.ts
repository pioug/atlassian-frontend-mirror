import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { handlePropSpread } from './migrations/handle-prop-spread';
import { inlineWidthNamesDeclaration } from './migrations/inline-WidthNames-declaration';
import { mapActionsProp } from './migrations/map-actions-prop';
import { mapBodyFromProps } from './migrations/map-body-from-props';
import { mapContainerFromProps } from './migrations/map-container-from-props';
import { mapFooterFromProps } from './migrations/map-footer-from-props';
import { mapHeaderFromProps } from './migrations/map-header-from-props';
import { mapHeadingPropToModalTitle } from './migrations/map-heading-prop';
import { removeAppearanceProp } from './migrations/remove-appearance-prop';
import { removeComponentOverrideProps } from './migrations/remove-component-override-props';
import { removeIsChromeless } from './migrations/remove-is-chromeless';
import { renameAppearanceType } from './migrations/rename-appearance-type';
import { renameInnerComponentPropTypes } from './migrations/rename-inner-component-prop-types';
import { renameScrollBehaviorToShouldScrollInViewport } from './migrations/rename-scrollBehavior-to-shouldScrollInViewport';

/**
 * The order of these migrations matters!
 * Mapping the container usage, along with removal of key props
 * such as the 'components' and 'appearance' should come last
 * after the other migrations.
 */
const transformer = createTransformer(
  [
    mapBodyFromProps,
    mapHeaderFromProps,
    mapFooterFromProps,
    renameScrollBehaviorToShouldScrollInViewport,
    renameAppearanceType,
    renameInnerComponentPropTypes,
    inlineWidthNamesDeclaration,
    mapHeadingPropToModalTitle,
    mapActionsProp,
    mapContainerFromProps,
    removeComponentOverrideProps,
    removeAppearanceProp,
    removeIsChromeless,
    handlePropSpread,
  ],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, '@atlaskit/modal-dialog'),
);

export default transformer;
