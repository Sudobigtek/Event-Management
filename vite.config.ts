import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import path from 'path';  

export default defineConfig({  
  plugins: [react()],  
  optimizeDeps: {  
    exclude: ['lucide-react'],  
  },  
  resolve: {  
    alias: {  
      '@': path.resolve(__dirname, './src'),  
    },  
  },  
  base: '/Event-Management/',  // Add this line and replace <repository-name> with your actual repository name  
});  