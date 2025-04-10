import featureFlags from "@/config/feature-flags.json";

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Record<string, boolean>;

  constructor() {
    this.flags = featureFlags.features;
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  public isEnabled(flag: string): boolean {
    return !!this.flags[flag];
  }
}

export default new FeatureFlagService();
