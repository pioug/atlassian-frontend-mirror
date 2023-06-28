export enum NetworkStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface NetworkProps {
  initialStatus?: NetworkStatus;
  onlineCallback?: () => void;
}

export default class Network {
  status?: NetworkStatus;
  onlineCallback?: () => void;

  constructor(props?: NetworkProps) {
    if (props?.initialStatus) {
      this.status = props.initialStatus;
    }
    if (props?.onlineCallback) {
      this.onlineCallback = props.onlineCallback;
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('offline', this.offlineHandler);
      window.addEventListener('online', this.onlineHandler);
    }
  }

  private offlineHandler = () => {
    this.status = NetworkStatus.OFFLINE;
  };

  private onlineHandler = () => {
    this.status = NetworkStatus.ONLINE;
    if (this.onlineCallback) {
      this.onlineCallback();
    }
  };

  getStatus(): NetworkStatus | null {
    return this.status || null;
  }

  destroy() {
    window.removeEventListener('offline', this.offlineHandler);
    window.removeEventListener('online', this.onlineHandler);
  }
}
