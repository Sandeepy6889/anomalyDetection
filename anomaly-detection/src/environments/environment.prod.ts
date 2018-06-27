const protocol = window.location.protocol + '//';
const host = window.location.host;

export const environment = {
  production: true,
  baseUrl : protocol + host
};
