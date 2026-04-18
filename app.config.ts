import 'dotenv/config';
import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'THE REBOOT',
  slug: 'the-reboot',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  assetBundlePatterns: ['**/*'],
  extra: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
};

export default config;
