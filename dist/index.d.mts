interface IConnectionInfo {
    serverUrl: string;
    token: string;
    autoConnect?: boolean;
}
type JsonPrimitive = string | number | boolean;
interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {
}
interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {
}
type Primitives = JsonPrimitive | JsonMap | JsonArray;
interface IMessage<M> {
    message: M;
    event?: string;
    timeout?: number;
}
interface IPullyClassInstance {
    sendMessage: <M extends Primitives>(payload: IMessage<M>) => void;
    unsubscribe: () => void;
    listen: (params: IListen) => void;
}
interface IListen {
    eventName?: string;
    callback: (data: any) => void;
}

declare class Pully {
    private serverUrl;
    private socketInstance;
    protected channels: string[];
    protected pullyClassInstance: IPullyClassInstance;
    constructor(connectionInfo: IConnectionInfo);
    /**
     * Subscribe to a channel
     * @param {string} channelName (required) - The name of the channel to subscribe to.
     * */
    subscribe(channelName: string): IPullyClassInstance;
    /**
     * Un-Subscribe from a channel
     * @param {string} channelName (required) - The name of the channel to unsubscribe from.
     * */
    unsubscribe(channelName: string): void;
    /**
     * Check if a channel exists
     * @param {string} channelName (required) - The name of the channel to check
     * */
    channelExists(channelName: string): boolean;
    /**
     * Retrieve all channels
     * */
    getChannels(): string[];
    /**
     * Connect to socket instance. You need to call this if autoConnect is set to false
     * */
    connect(): void;
    /**
     * Send Message to a channel
     * @param {string} channelName: (required) - The name of the channel you want to send a message to
     * @returns (message: M) => void
     * */
    sendMessage<M extends Primitives>(channelName: string, data: IMessage<M>): void;
    /**
     * Listen to a custom event
     * @param {string} eventName (required) - The name of the channel to listen to.
     * */
    listen({ eventName, callback }: IListen): void;
    protected _listen(): ({ eventName, callback, }: IListen) => void;
    protected _sendMessage<M extends Primitives>(channelName: string): (data: IMessage<M>) => void;
    protected _checkConnection: () => void;
}

export { Pully as default };
