import { request } from "@/services/api/core/request";
import { CurrenciesPairDto } from "@/services/api/models/currencies-pair-dto";

const URL = "https://api.binance.com";

export class ApiMarketBinanceService {
  public getCurrenciesPairs() {
    return request<CurrenciesPairDto[]>({
      url: URL,
      path: "api/v3/ticker/24hr",
    });
  }
}
const apiMarketBinanceService = new ApiMarketBinanceService();
export default apiMarketBinanceService;
