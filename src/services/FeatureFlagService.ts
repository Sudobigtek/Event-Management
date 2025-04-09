import * as featureFlags from '../../config/feature-flags.json';

interface FeatureFlags {
  [key: string]: boolean;
}

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private features: FeatureFlags = {};

  private constructor() {
    this.loadFeatures();
  }

  private loadFeatures(): void {
    Object.entries(featureFlags.features).forEach(([key, value]) => {
      this.features[key] = value.enabled;
    });
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  public isEnabled(featureName: string): boolean {
    return Boolean(this.features[featureName]);
  }
}

export default new FeatureFlagService();
