// Vite replaces BASE_URL during build, including GitHub Pages /repository/ paths.
export const publicAsset = path => import.meta.env.BASE_URL + path.replace(/^\/+/, '');
