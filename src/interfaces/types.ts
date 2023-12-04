export interface IConnectionInfo {
  serverUrl?: string;
  token: string;
  appId: string;
  autoConnect?: boolean;
}

export type JsonPrimitive = string | number | boolean;
interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {}
interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {}
export type Primitives = JsonPrimitive | JsonMap | JsonArray;

export interface IMessage<M> {
  message: M;
  event?: string;
  timeout?: number;
}

export interface IPullyClassInstance {
  sendMessage: <M extends Primitives>(payload: IMessage<M>) => void;
  unsubscribe: () => void;
  listen: (params: IListen) => void;
}

export interface IListen {
  eventName?: string;
  callback: (data: IListenReturn) => void;
}

export interface IListenReturn {
  channel: string;
  data: any;
}
