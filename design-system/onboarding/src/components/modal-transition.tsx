/**
 * We re-export this because products may have multiple versions of
 * `@atlaskit/modal-dialog`.
 *
 * If a consumer uses the onboarding `Modal` with the `ModalTransition` from an
 * incompatible version of `@atlaskit/modal-dialog`, then the modal can get
 * stuck in an open state.
 *
 * See https://product-fabric.atlassian.net/browse/DSP-796 for more details
 * and a reproduction.
 *
 */
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

/**
 * @deprecated Use `@atlaskit/spotlight` instead.
 */
export default ModalTransition;
