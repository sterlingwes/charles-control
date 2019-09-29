import * as request from 'request-promise-native';
import { getRecordingStatus, getToolStatus } from './charles-web-parsers';

interface Options {
  proxyHost: string;
  webHost: string;
}

export enum Tool {
  Breakpoints = 'breakpoints',
  ReverseProxies = 'reverse-proxies',
  PortForwarding = 'port-forwarding',
  NoCaching = 'no-caching',
  BlockCookies = 'block-cookies',
  MapRemote = 'map-remote',
  MapLocal = 'map-local',
  Rewrite = 'rewrite',
  BlackList = 'black-list',
  WhiteList = 'white-list',
  DnsSpoofing = 'dns-spoofing',
  AutoSave = 'auto-save',
  ClientProcess = 'client-process',
}

type Parser = (html: string) => boolean | null;

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

  async get(command: string, parser: Parser) {
    const response = await this.makeRequest(command);
    return parser(response.body);
  }

  isRecording() {
    return this.get('recording', getRecordingStatus);
  }

  isToolEnabled(tool: Tool) {
    return this.get(`tools/${tool}`, getToolStatus);
  }

  enableTool(tool: Tool) {
    return this.makeRequest(`tools/${tool}/enable`);
  }

  disableTool(tool: Tool) {
    return this.makeRequest(`tools/${tool}/disable`);
  }
}
