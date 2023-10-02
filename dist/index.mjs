// src/index.ts
import { io } from "socket.io-client";
var PULLY_EVENTS = {
  SUBSCRIBE: "subscribe",
  RECEIVE_MESSAGE: "message",
  UNSUBSCRIBE: "unsubscribe",
  SEND_MESSAGE: "send_message"
};
var Pully = class {
  serverUrl;
  socketInstance = null;
  channels = [];
  pullyClassInstance = {};
  constructor(connectionInfo) {
    this.serverUrl = connectionInfo.serverUrl;
    if (!this.socketInstance) {
      const token = connectionInfo.token;
      const autoConnect = connectionInfo.autoConnect;
      const connected = autoConnect !== void 0 ? autoConnect : true;
      this.socketInstance = io(this.serverUrl, {
        // autoConnect: connected,
        extraHeaders: {
          token
        }
      });
    }
    this.pullyClassInstance.listen = () => null;
    this.pullyClassInstance.sendMessage = () => null;
    this.pullyClassInstance.unsubscribe = () => null;
  }
  /**
   * Subscribe to a channel
   * @param {string} channelName (required) - The name of the channel to subscribe to.
   * */
  subscribe(channelName) {
    this.socketInstance?.emit(PULLY_EVENTS.SUBSCRIBE, channelName);
    this.channels.push(channelName);
    const listen = this._listen();
    const sendMessage = this._sendMessage(channelName);
    const unsubscribe = () => this.unsubscribe(channelName);
    this.pullyClassInstance.listen = listen;
    this.pullyClassInstance.sendMessage = sendMessage;
    this.pullyClassInstance.unsubscribe = unsubscribe;
    return this.pullyClassInstance;
  }
  /**
   * Un-Subscribe from a channel
   * @param {string} channelName (required) - The name of the channel to unsubscribe from.
   * */
  unsubscribe(channelName) {
    this.socketInstance?.emit(PULLY_EVENTS.UNSUBSCRIBE, channelName);
    const channelIndex = this.channels.findIndex(
      (channel) => channel === channelName
    );
    const channels = [...this.channels];
    channels.splice(channelIndex, 1);
    this.channels = channels;
  }
  /**
   * Check if a channel exists
   * @param {string} channelName (required) - The name of the channel to check
   * */
  channelExists(channelName) {
    if (this.channels.includes(channelName)) {
      return true;
    }
    return false;
  }
  /**
   * Retrieve all channels
   * */
  getChannels() {
    return this.channels;
  }
  /**
   * Connect to socket instance. You need to call this if autoConnect is set to false
   * */
  connect() {
    this.socketInstance?.connect();
  }
  /**
   * Send Message to a channel
   * @param {string} channelName: (required) - The name of the channel you want to send a message to
   * @returns (message: M) => void
   * */
  sendMessage(channelName, data) {
    const sendMessage = this._sendMessage(channelName);
    return sendMessage(data);
  }
  /**
   * Listen to a custom event
   * @param {string} eventName (required) - The name of the channel to listen to.
   * */
  listen({ eventName, callback }) {
    const listen = this._listen();
    listen({ eventName, callback });
  }
  _listen() {
    return ({
      eventName = PULLY_EVENTS.RECEIVE_MESSAGE,
      callback
    }) => {
      this.socketInstance?.on(eventName, (data) => {
        callback(data);
      });
    };
  }
  _sendMessage(channelName) {
    return (data) => {
      const { event, message, timeout = 0 } = data;
      const messageToSend = {
        channelName,
        message,
        event
      };
      if (timeout > 0) {
        this.socketInstance?.timeout(timeout).emit(PULLY_EVENTS.SEND_MESSAGE, messageToSend);
      } else {
        this.socketInstance?.emit(PULLY_EVENTS.SEND_MESSAGE, messageToSend);
      }
    };
  }
  _checkConnection = () => {
    if (!this.socketInstance?.connected) {
      throw new Error(
        "You need to Connect to the Socket Instance. Call the connect method to instantiate a connection"
      );
    }
  };
};
var src_default = Pully;
export {
  src_default as default
};
//# sourceMappingURL=index.mjs.map