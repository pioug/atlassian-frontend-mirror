import { Server, Router, Database } from 'kakapo';
import { createApiRouter } from './routers/api-router';
import { createDatabase, MediaDatabaseSchema } from './database';
import { MockCollections } from './types';

export class MediaMock {
  private server = new Server<MediaDatabaseSchema>();
  private routers: Router<MediaDatabaseSchema>[] = [];
  private dbs: Database<MediaDatabaseSchema>[] = [];

  constructor(readonly collections?: MockCollections) {}

  enable(): void {
    this.routers = [createApiRouter()];

    this.dbs = [createDatabase(this.collections)];

    [...this.routers, ...this.dbs].forEach(this.server.use.bind(this.server));
  }

  disable(): void {
    [...this.routers, ...this.dbs].forEach(
      this.server.remove.bind(this.server),
    );
    this.routers.forEach(router => router.reset());
    this.dbs.forEach(db => db.reset());
    this.routers = [];
    this.dbs = [];
  }
}
