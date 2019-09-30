import { getVersion, DEFAULT_CHARLES_PATH } from './charles-bin-interface';
import { CharlesWebManager } from './charles-web-interface';

interface Options {
  path?: string;
  host?: string;
  port?: number;
  webHost?: string;
  webHostUser?: string;
  webHostPass?: string;
}

const addDefaults = ({ path, host, port, webHost, webHostUser, webHostPass }: Options): Required<Options> => ({
  path: path || DEFAULT_CHARLES_PATH,
  host: host || 'localhost',
  port: port || 8888,
  webHost: webHost || 'control.charles',
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
