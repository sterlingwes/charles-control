import { getVersion, DEFAULT_CHARLES_PATH } from './charles-bin-interface';

interface Options {
  path?: string;
  host?: string;
  port?: number;
  webHost: string;
}

const addDefaults = ({ path, host, port, webHost }: Options): Required<Options> => ({
  path: path || DEFAULT_CHARLES_PATH,
  host: host || 'localhost',
  port: port || 8888,
  webHost: webHost || 'control.charles',
});

export class CharlesControl {
  options: Required<Options>;

  constructor(options: Options) {
    this.options = addDefaults(options);
  }
}
