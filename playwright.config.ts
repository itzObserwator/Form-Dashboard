import {defineConfig} from "@playwright/test";
export default defineConfig({testDir:"./tests",use:{baseURL:"http://localhost:3001",viewport:{width:390,height:1000},reducedMotion:"reduce"},webServer:{command:"npm run dev",url:"http://localhost:3001",reuseExistingServer:!process.env.CI},workers:1});
