import { NamespaceStatus } from '../types';
import { createLogger } from '../helpers/utils';

const logger = createLogger('Provider', 'orange');

/**
 * Allows us to keep track of any namespace changes from the server.
 * @param isNamespaceLocked - whether the namespace is locked or not, defaults to false
 */
export class NamespaceService {
  constructor(private isNamespaceLocked: boolean = false) {}

  // Primitive values are always copied
  getIsNamespaceLocked = () => this.isNamespaceLocked;

  /**
   * ESS-2916 namespace status event- lock/unlock
   */
  onNamespaceStatusChanged = async ({
    isLocked,
    waitTimeInMs,
    timestamp,
  }: NamespaceStatus) => {
    const start = Date.now();
    logger(`Received a namespace status changed event `, {
      isLocked,
      waitTimeInMs,
      timestamp,
    });
    if (isLocked && waitTimeInMs) {
      this.isNamespaceLocked = true;
      logger(`Received a namespace status change event `, {
        isLocked,
      });

      // To protect the collab editing process from locked out due to BE
      setTimeout(() => {
        logger(`The namespace lock has expired`, {
          waitTime: Date.now() - start,
          timestamp,
        });
        this.isNamespaceLocked = false;
      }, waitTimeInMs);
      return;
    }
    this.isNamespaceLocked = false;
    logger(`The page lock has expired`);
  };
}
