import * as request from 'request-promise-native';
import { getRecordingStatus } from './web-interface-parsers';

interface Options {
  proxyHost: string;
  webHost: string;
}

type Parser = (html: string) => boolean;

export class CharlesWebRequest {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  async makeRequest(path: string) {
    const { webHost, proxyHost } = this.options;

    const response = await request({
      uri: `http://${webHost}/${path}/`,
      proxy: `http://${proxyHost}`,
      resolveWithFullResponse: true,
    });

    return response;
  }

  async pipe(command: string, parser: Parser) {
    const response = await this.makeRequest(command);
    return parser(response.body);
  }

  isRecording() {
    return this.pipe(
      'recording',
      getRecordingStatus,
    );
  }
}
