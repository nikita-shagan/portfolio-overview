import { CurrencyModel } from "@/models/currency-model";
import { BASE_CURRENCY } from "@/utils/constants";

const BASE_SOCKET_URL = "wss://stream.binance.com:9443/stream?streams=";

class ApiStreamBinanceService {
  private socket: WebSocket | null = null;
  private updateCallback: ((currencies: CurrencyModel[]) => void) | null = null;
  private symbols: string[] = [];
  private bufferedUpdates: CurrencyModel[] = [];
  private updateTimeout: NodeJS.Timeout | null = null;
  private timeoutDelay = 1000;

  private flushUpdates() {
    if (this.bufferedUpdates.length && this.updateCallback) {
      this.updateCallback(this.bufferedUpdates);
      this.bufferedUpdates = [];
    }
  }

  private onMessage(event: MessageEvent) {
    try {
      const parsedData = JSON.parse(event.data) as {
        stream: string;
        data: { s: string; a: string; P: string };
      };
      if (parsedData.stream && parsedData.data) {
        const currency: CurrencyModel = {
          name: parsedData.data.s.replace(BASE_CURRENCY, ""),
          price: parsedData.data.a,
          changePercent: parsedData.data.P,
        };
        this.bufferedUpdates.push(currency);
        if (!this.updateTimeout) {
          this.updateTimeout = setTimeout(() => {
            this.flushUpdates();
            this.updateTimeout = null;
          }, this.timeoutDelay);
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  private connect() {
    if (!this.symbols.length) return;
    const socketUrl = BASE_SOCKET_URL + this.symbols.join("/");
    this.socket = new WebSocket(socketUrl);
    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    };
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  setUpdateCallback(callback: (currencies: CurrencyModel[]) => void) {
    this.updateCallback = callback;
  }

  subscribeToAssets(symbols: string[]) {
    const sortedSymbols = symbols
      .map((s) => `${s.toLowerCase()}${BASE_CURRENCY.toLowerCase()}@ticker`)
      .sort();
    if (JSON.stringify(this.symbols) !== JSON.stringify(sortedSymbols)) {
      this.symbols = sortedSymbols;
      this.disconnect();
      this.connect();
    }
  }
}

const apiStreamBinanceService = new ApiStreamBinanceService();
export default apiStreamBinanceService;
