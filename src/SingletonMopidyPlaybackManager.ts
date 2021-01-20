import Mopidy from "mopidy";

export interface MopidyEventCallbacks {
    online: () => Promise<void>;
    tracklistChanged: () => Promise<void>;
}

export class SingletonMopidyPlaybackManager {
    private static mopidy;

    static async startMopidy({online, tracklistChanged}: MopidyEventCallbacks) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        // @ts-ignore
        window.mopidy = mopidyInstance;
        mopidyInstance.on("state:online", online);
        mopidyInstance.on('event:playbackStateChanged', ({old_state, new_state}) => null);
        mopidyInstance.on('event:tracklistChanged', tracklistChanged);
        mopidyInstance.on('event:trackPlaybackPaused', () => null);
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
        console.error('stop is called')
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

    static async getImagesForTracks(tracks, callback) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        if (tracks.length > 0) {
            const uris = tracks.map(track => track.uri);
            mopidyInstance.library
                .getImages({uris})
                .then((result) => callback(result));
        } else {
            callback([]);
        }
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
    }

    static async seek(newTimeInSeconds: number) {
        const mopidyInstance = SingletonMopidyPlaybackManager.getMopidyInstance();
        await mopidyInstance.playback.seek({time_position: newTimeInSeconds});
    }
}