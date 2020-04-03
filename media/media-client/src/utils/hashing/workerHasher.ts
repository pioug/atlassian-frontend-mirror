import uuidV4 from 'uuid/v4';
import Rusha from 'rusha';
import { Hasher } from './hasher';

interface HasherWorker {
  worker: Worker;
  activeJobs: number;
}

export interface Deferred {
  resolve: (hash: string) => void;
  reject: (error: any) => void;
}

export class WorkerHasher implements Hasher {
  private workers: Array<HasherWorker> = [];
  private jobs: { [id: string]: Deferred } = {};

  constructor(numOfWorkers: number) {
    for (let i = 0; i < numOfWorkers; ++i) {
      this.workers.push(this.createWorker());
    }
  }

  hash(chunk: Blob): Promise<string> {
    return this.calculateHashInWorker(chunk);
  }

  private createWorker(): HasherWorker {
    const worker = Rusha.createWorker();
    const hasherWorker = { worker, activeJobs: 0 };

    worker.addEventListener('message', (event: MessageEvent) => {
      this.handleWorkerMessage(event, hasherWorker);
    });

    return hasherWorker;
  }

  private handleWorkerMessage(
    event: MessageEvent,
    hasherWorker: HasherWorker,
  ): void {
    const id = event.data.id;

    if (this.jobs[id]) {
      const { resolve, reject } = this.jobs[id];
      delete this.jobs[id];
      hasherWorker.activeJobs--;

      if (event.data.error) {
        // TODO previously we were just calling it again.
        // this.calculateHashInWorker(chunk);
        reject(event.data.error);
      } else {
        resolve(event.data.hash);
      }
    }
  }

  private calculateHashInWorker(blob: Blob): Promise<string> {
    const jobId = uuidV4();
    return new Promise((resolve, reject) => {
      this.jobs[jobId] = { resolve, reject };

      const worker = this.getMostRelaxedWorker();
      this.dispatch(jobId, worker, blob);
    });
  }

  private dispatch(
    jobId: string,
    hasherWorker: HasherWorker,
    chunkBlob: Blob,
  ): void {
    hasherWorker.activeJobs++;
    const worker = hasherWorker.worker;

    /*
     * postMessage() with chunk blob in Safari results in the error
     * "Failed to load resource: The operation could not be completed. (WebKitBlobResource error 1.)"
     *
     * To prevent it, we read the data from the blob using FileReader and pass it via postMessage to the worker.
     */
    if (
      navigator.userAgent.indexOf('Safari') > -1 &&
      navigator.userAgent.indexOf('Chrome') === -1
    ) {
      const rd = new FileReader();
      rd.onload = () => {
        worker.postMessage({ id: jobId, data: rd.result });
      };
      rd.readAsBinaryString(chunkBlob);
      return;
    }

    worker.postMessage({ id: jobId, data: chunkBlob });
  }

  private getMostRelaxedWorker(): HasherWorker {
    return this.workers.reduce((current, next) => {
      if (next.activeJobs < current.activeJobs) {
        return next;
      }

      return current;
    }, this.workers[0]);
  }
}
