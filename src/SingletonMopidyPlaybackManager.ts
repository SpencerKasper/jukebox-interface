import Mopidy from "mopidy";

export interface MopidyEventCallbacks {
    online?: () => Promise<void>;
    offline?: () => Promise<void>;
    tracklistChanged?: () => Promise<void>;
    trackPlaybackStarted?: () => Promise<void>;
    trackPlaybackEnded?: () => Promise<void>;
    playbackStateChanged?: ({old_state, new_state}) => Promise<void>;
}

export class SingletonMopidyPlaybackManager {
    private static mopidy;

    static async startMopidy({
                                 online,
        offline,
                                 tracklistChanged,
                                 trackPlaybackStarted,
                                 trackPlaybackEnded,
                                 playbackStateChanged,
                             }: MopidyEventCallbacks) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        // @ts-ignore
        window.mopidy = mopidyInstance;
        mopidyInstance.on("state:online", online);
        mopidyInstance.on('state:offline', offline)
        mopidyInstance.on('event:playbackStateChanged', playbackStateChanged);
        tracklistChanged && mopidyInstance.on('event:tracklistChanged', tracklistChanged);
        mopidyInstance.on('event:trackPlaybackEnded', trackPlaybackEnded);
        mopidyInstance.on('event:trackPlaybackStarted', trackPlaybackStarted);
        mopidyInstance.on('state', console.error);
        mopidyInstance.on('event', console.error);
    };

    static getMopidyInstance() {
        if (!SingletonMopidyPlaybackManager.mopidy) {
            SingletonMopidyPlaybackManager.mopidy = new Mopidy({
                webSocketUrl: "ws://10.0.0.69:6680/mopidy/ws/",
            });
        }
        return SingletonMopidyPlaybackManager.mopidy;
    }

    static async getCurrentlyPlayingTrackInfo() {
        const trackInfo = await SingletonMopidyPlaybackManager.getCurrentlyPlayingTrack();
        const trackImage = await SingletonMopidyPlaybackManager.getImagesForTracks([trackInfo]);
        return {
            trackInfo,
            trackImage,
        };
    }

    static async clearAllAndPlay(track) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.tracklist.clear();
        await mopidyInstance.tracklist.add({tracks: [track]});
        // @ts-ignore
        await mopidyInstance.playback.play();
    }

    static async playNextSongInQueue() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.playback.next();
    }

    static async addSongToQueue(track) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.tracklist.add({tracks: [track]});
        if (await mopidyInstance.playback.getState() !== 'playing') {
            // @ts-ignore
            await mopidyInstance.playback.play();
        }
    }

    static async resume() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.playback.resume();
    }

    static async pause() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.playback.pause();

    }

    static async stop() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.playback.stop();
    }

    static async getCurrentlyPlayingTrack() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.playback.getCurrentTrack();
    }

    static async search(queryField, searchTerm) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.library.search({query: {[queryField]: [searchTerm]}});
    }

    static async getImagesForTracks(tracks) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        const filteredTracks = tracks.filter(track => track);
        if (filteredTracks.length > 0) {
            const uris = filteredTracks.map(track => track.uri);
            return mopidyInstance.library
                .getImages({uris});
        }
        return [];
    }

    static async getPlaybackState() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.playback.getState();
    }

    static async getQueue() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.tracklist.getTracks();
    }

    static async getListOfPlaylists() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        const playlists = await mopidyInstance.playlists.asList();
        console.error(playlists);
        return playlists;
    }

    static async getTracksInPlaylist(uri: string) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.playlists.getItems({uri})
    }

    static async seek(newTimeInSeconds: number) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        const currentPlaybackTime = await SingletonMopidyPlaybackManager.getCurrentPlaybackTime();
        if(newTimeInSeconds < currentPlaybackTime) {
            // Stupid hack since rewinding doesn't work I guess.
            await mopidyInstance.playback.seek({time_position: newTimeInSeconds - 1});
            await mopidyInstance.playback.seek({time_position: newTimeInSeconds});
        }
        await mopidyInstance.playback.seek({time_position: newTimeInSeconds});
    }

    static async getCurrentPlaybackTime() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.playback.getTimePosition();
    }

    static async setVolume(newVolume: number) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.mixer.setVolume({volume: newVolume});
    }

    static async getVolume() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.mixer.getVolume();
    }

    static async setMute(isMute: boolean) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.mixer.setMute({mute: isMute});
    }

    static async getMute() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return await mopidyInstance.mixer.getMute();
    }

    static async getMopidyConnectionStatus() {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        return mopidyInstance && mopidyInstance.playback && mopidyInstance.playback.getState() !== 'offline';
    }
}