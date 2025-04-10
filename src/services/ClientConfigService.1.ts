import { FeatureFlagService } from "./FeatureFlagService";

export class ClientConfigService {
  private featureFlagService: FeatureFlagService;

  constructor() {
    this.featureFlagService = FeatureFlagService.getInstance();
  }

  public getClientConfig(): Record<string, any> {
    return {
      gemini2Flash: this.featureFlagService.isEnabled("gemini2Flash"),
    };
  }
}
