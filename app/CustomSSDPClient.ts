import { EventEmitter } from 'events';
import dgram from 'react-native-udp';

export class CustomSSDPClient extends EventEmitter {
  private socket: any;

  constructor() {
    super();
    this.socket = dgram.createSocket('udp4');
    
    this.socket.on('message', (msg, rinfo) => {
      const headers = this.parseHeaders(msg.toString());
      this.emit('response', headers, 200, rinfo);
    });
  }

  search(st: string) {
    const query = Buffer.from(
      'M-SEARCH * HTTP/1.1\r\n' +
      'HOST: 239.255.255.250:1900\r\n' +
      'MAN: "ssdp:discover"\r\n' +
      'MX: 1\r\n' +
      `ST: ${st}\r\n` +
      '\r\n'
    );

    this.socket.send(query, 0, query.length, 1900, '239.255.255.250', (err) => {
      if (err) console.error('Error sending SSDP query:', err);
    });
  }

  private parseHeaders(message: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = message.split('\r\n');
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        headers[key.trim().toUpperCase()] = value.trim();
      }
    });
    return headers;
  }
}
