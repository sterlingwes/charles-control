import { CharlesWebRequest, Tool } from './charles-web-interface';

const okResponse = (body: string) => Promise.resolve({ body });
const mock404 = new Error('StatusCodeError: 404');

describe('Charles web interface', () => {
  let charlesWeb: CharlesWebRequest;
  let requestSpy: jest.Mock;

  beforeEach(() => {
    charlesWeb = new CharlesWebRequest({ proxyHost: 'localhost:8888', webHost: 'control.charles' });
    requestSpy = jest.fn();
    charlesWeb.makeRequest = requestSpy;
  });

  describe('isRecording', () => {
    const recordingResponse = (status: string) => `<html>
<head>
    <title>Charles Web Interface</title>
    <link rel="stylesheet" href="../css/plain.css" />
</head>
<body>
<h1>Charles Web Interface</h1>
<h2>Recording</h2>
<p>Status: ${status}</p>
<ul>
    <li><a href="start">Start</a></li>
    <li><a href="stop">Stop</a></li>
    <li><a href="../">Back</a></li>
</ul>
</body>
</html>`;

    describe('when recording', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(recordingResponse('Recording')));
      });

      it('should return true', async () => {
        const state = await charlesWeb.isRecording();
        expect(requestSpy).toHaveBeenCalledWith('recording');
        expect(state).toBe(true);
      });
    });

    describe('when not recording', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(recordingResponse('Recording Stopped')));
      });

      it('should return false', async () => {
        const state = await charlesWeb.isRecording();
        expect(state).toBe(false);
      });
    });

    describe('when response is unexpected', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(recordingResponse('Not sure')));
      });

      it('should return null', async () => {
        const state = await charlesWeb.isRecording();
        expect(state).toBe(null);
      });
    });

    describe('when response is not 200', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(Promise.reject(mock404));
      });

      it('should propagate error', async () => {
        await expect(charlesWeb.isRecording()).rejects.toEqual(mock404);
      });
    });
  });

  describe('isToolEnabled', () => {
    const toolResponse = (status: string) => `<html>
<head>
    <title>Charles Web Interface</title>
    <link rel="stylesheet" href="../../css/plain.css" />
</head>
<body>
<h1>Charles Web Interface</h1>
<h2>Port Forwarding</h2>
<p>Status: ${status}</p>
<ul>
    <li><a href="enable">Enable</a></li>
    <li><a href="disable">Disable</a></li>
    <li><a href="../">Back</a></li>
</ul>
</body>
</html>`;

    describe('when tool enabled', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(toolResponse('Enabled')));
      });

      it('should return true', async () => {
        const state = await charlesWeb.isToolEnabled(Tool.PortForwarding);
        expect(requestSpy).toHaveBeenCalledWith('tools/port-forwarding');
        expect(state).toBe(true);
      });
    });

    describe('when tool disabled', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(toolResponse('Disabled')));
      });

      it('should return true', async () => {
        const state = await charlesWeb.isToolEnabled(Tool.PortForwarding);
        expect(state).toBe(false);
      });
    });

    describe('when response unrecognized', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(okResponse(toolResponse('🤷‍♀️')));
      });

      it('should return null', async () => {
        const state = await charlesWeb.isToolEnabled(Tool.PortForwarding);
        expect(state).toBe(null);
      });
    });

    describe('when response is not 200', () => {
      beforeEach(() => {
        requestSpy.mockReturnValue(Promise.reject(mock404));
      });

      it('should propagate error', async () => {
        await expect(charlesWeb.isToolEnabled(Tool.PortForwarding)).rejects.toEqual(mock404);
      });
    });
  });

  describe('enable', () => {
    it('should have the expected request path', async () => {
      await charlesWeb.enableTool(Tool.MapLocal);
      expect(requestSpy).toHaveBeenCalledWith('tools/map-local/enable');
    });
  });

  describe('disable', () => {
    it('should have the expected request path', async () => {
      await charlesWeb.disableTool(Tool.MapLocal);
      expect(requestSpy).toHaveBeenCalledWith('tools/map-local/disable');
    });
  });
});
