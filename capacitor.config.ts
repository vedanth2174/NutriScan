
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nutriscan.app',
  appName: 'NutriScan',
  webDir: 'public',
  server: {
    url: 'https://nutriscan-gos1.onrender.com',
    cleartext: false,
  },
};

export default config;
