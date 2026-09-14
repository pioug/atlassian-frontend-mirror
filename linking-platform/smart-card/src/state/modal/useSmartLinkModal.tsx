import { useContext } from 'react';

import { SmartLinkModalContext } from './index';
import { type SmartLinkModalAPI } from './types';

/**
 * Open (lazy load) modal
 *
 * This hook injects the element below Card and standalone HoverCard component.
 * It is intended to solve the issue where modal triggered by the parent component
 * disappear when the parent component is unmounted.
 *
 * For example, clicking on hover card action to open a modal. Once the modal is opened,
 * hover card disappears.
 *
 * Usage:
 *   const modal = useSmartLinkModal()
 *   modal.open(<SomeLazyLoadModal isOpen={true} onClose={() => modal.close()} />);
 */
export const useSmartLinkModal = (): SmartLinkModalAPI => useContext(SmartLinkModalContext);
