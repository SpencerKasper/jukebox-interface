const DOMAIN = process.env.REACT_APP_JUKEBOX_API_DOMAIN;
export const getGetAmbientQueueEndpoint = (owner) => `${DOMAIN}ambientQueue/${encodeURIComponent(owner)}`;
export const getNextSongInAmbientQueueEndpoint = (owner) => `${DOMAIN}ambientQueue/nextSong/${encodeURIComponent(owner)}`;