import * as request from 'request-promise-native';
import { getRecordingStatus, getToolStatus } from './charles-web-parsers';

interface Options {
  proxyHost: string;
  webHost: string;
  credentials?: {
    user: string;
    pass: string;
  };
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

type RequestHeaders = { Authorization?: string };

export class CharlesWebManager {
  options: Options;
  active: boolean;

  constructor(options: Options) {
    this.options = options;
    this.active = false;
  }

  get basicAuthHeaderValue() {
    if (!this.options.credentials) return '';
    const { user, pass } = this.options.credentials;
    const auth = btoa(`${user}:${pass}`);
    return `Basic ${auth}`;
  }

  async makeRequest(path: string) {
    const { webHost, proxyHost } = this.options;

    let headers: RequestHeaders = {};
    if (this.options.credentials) {
      headers.Authorization = this.basicAuthHeaderValue;
    }

    const response = await request({
      uri: `http://${webHost}/${path}/`,
      proxy: `http://${proxyHost}`,
      resolveWithFullResponse: true,
      headers,
    });

    return response;
  }

  async get(command: string, parser: Parser) {
    const response = await this.makeRequest(command);
    return parser(response.body);
  }

  async healthcheck() {
    let status;
    try {
      status = await this.isRecording();
    } finally {
      this.active = typeof status !== 'undefined';
    }
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
