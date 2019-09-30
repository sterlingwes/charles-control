import { getVersion, DEFAULT_CHARLES_PATH } from './charles-bin-interface';
import { CharlesWebManager } from './charles-web-interface';

export interface Options {
  path?: string;
  host?: string;
  port?: number;
  webHost?: string;
  webHostUser?: string;
  webHostPass?: string;
}

export const DEFAULT_CHARLES_HOST = 'localhost';
export const DEFAULT_CHARLES_PORT = 8888;
export const DEFAULT_CHARLES_WEB_HOST = 'control.charles';

const addDefaults = ({ path, host, port, webHost, webHostUser, webHostPass }: Options): Required<Options> => ({
  path: path || DEFAULT_CHARLES_PATH,
  host: host || DEFAULT_CHARLES_HOST,
  port: port || DEFAULT_CHARLES_PORT,
  webHost: webHost || DEFAULT_CHARLES_WEB_HOST,
  webHostUser: webHostUser || '',
  webHostPass: webHostPass || '',
});

export class CharlesControl {
  options: Required<Options>;
  liveManager: CharlesWebManager;

  constructor(options: Options) {
    this.options = addDefaults(options);
    this.liveManager = new CharlesWebManager({
      proxyHost: this.proxyHost,
      webHost: this.webHost,
      credentials: this.webCredentials,
    });
  }

  get proxyHost() {
    const { host, port } = this.options;
    return `${host}:${port}`;
  }

  get webHost() {
    return this.options.webHost;
  }

  get webCredentials() {
    const { webHostUser, webHostPass } = this.options;
    if (!webHostUser || !webHostPass) return;
    return {
      user: webHostUser,
      pass: webHostPass,
    };
  }
}
