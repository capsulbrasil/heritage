import { useApp, defineOptions } from 'aeria-ui'
import { routes } from './routes.js'
import { ptbr } from "./i18n/index.js";
import Main from './main.vue'
import NoResults from './components/no-results.vue'
import aeriaPtbr from "@aeria-ui/i18n-pt";

import "@aeria-ui/ui/style.css";
import "aeria-app-layout/style.css";
import "./style/main.less";

const options = defineOptions({
  component: Main,
  routes,
  i18n: {
    current: "pt_BR",
    locales: {
      pt_BR: [aeriaPtbr, ptbr],
    },
  },
  menuSchema: [
    "/dashboard/equipmentRelease",
    "/dashboard/asset",
    "/dashboard/employee",
    "/dashboard/user"
  ],
})

useApp(options).then(({ app, mount }) => {
  app.provide('noResultsComponent', NoResults)
  mount()
})

