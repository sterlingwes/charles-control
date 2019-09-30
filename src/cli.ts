import * as meow from 'meow';
import { CharlesControl, DEFAULT_CHARLES_HOST, DEFAULT_CHARLES_PORT, DEFAULT_CHARLES_WEB_HOST } from './index';
import { Tool } from './charles-web-interface';
import { resolveOptions } from './cli-option-resolver';
import { DEFAULT_CHARLES_PATH } from './charles-bin-interface';

const indent = '    ';
const tools = Object.values(Tool).join(`\n${indent}`);

const cli = meow(
  `
  Usage
    $ charlesctl <command>

  Commands
    status - get whether Charles is recording
    enable <feature>
    disable <feature>

  Supported features
    ${tools}

  Options
    --path, -p        Absolute path to your Charles.app (${DEFAULT_CHARLES_PATH})
    --host, -h        Charles proxy host (${DEFAULT_CHARLES_HOST})
    --port, -P        Charles proxy port (${DEFAULT_CHARLES_PORT})
    --web-host, -w    Charles web interface host (${DEFAULT_CHARLES_WEB_HOST})
    --web-host-user   Charles web interface user
    --web-host-pass   Charles web interface pass
`,
  {
    flags: {
      path: {
        type: 'string',
        alias: 'p',
      },
      host: {
        type: 'string',
        alias: 'h',
      },
      port: {
        type: 'string',
        alias: 'P',
      },
      webHost: {
        type: 'string',
        alias: 'w',
      },
      webHostUser: {
        type: 'string',
      },
      webHostPass: {
        type: 'string',
      },
    },
  },
);

if (!cli.input.length) {
  cli.showHelp();
}

const { liveManager } = new CharlesControl(resolveOptions(cli.flags));

const report = (ifTrue: string, ifFalse: string) => (flag: boolean | null) => {
  if (flag == null) {
    return 'unknown';
  }
  return console.log('>', flag ? ifTrue : ifFalse);
};

const reportFeatureState = (request: Promise<any>) =>
  request.then(() => liveManager.isToolEnabled(tool)).then(report('enabled', 'disabled'));

const validTools = Object.values(Tool);
const assertTool = (tool: Tool) => {
  if (!tool) {
    console.log(`> You must specify a feature to enable/disable, see --help`);
    process.exit(1);
  }

  if (validTools.includes(tool) === false) {
    console.log(`> Unknown feature: "${tool}", see --help for a list of suppported features`);
    process.exit(1);
  }
};

const [command, tool] = cli.input as [string, Tool];

switch (command) {
  case 'status':
    liveManager.isRecording().then(report('recording', 'not recording'));
    break;
  case 'enable':
    assertTool(tool);
    reportFeatureState(liveManager.enableTool(tool));
    break;
  case 'disable':
    assertTool(tool);
    reportFeatureState(liveManager.disableTool(tool));
    break;
  default:
    console.log(`> Unknown command: "${command}"\n`);
    process.exit(1);
}
