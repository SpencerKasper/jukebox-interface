import Mopidy from "mopidy";

export interface MopidyEventCallbacks {
    online: () => Promise<void>;
}

export class SingletonMopidyPlaybackManager {
    private static mopidy;

    static async startMopidy({online}: MopidyEventCallbacks) {
        const mopidyInstance = this.getMopidyInstance();
        // @ts-ignore
        window.mopidy = mopidyInstance;
        mopidyInstance.on("state:online", online);
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
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.tracklist.clear();
        await mopidyInstance.tracklist.add({tracks: [track]});
        // @ts-ignore
        await mopidyInstance.playback.play();
    }

    static async playNextSongInQueue() {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.playback.next();
    }

    static async addSongToQueue(track) {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.tracklist.add({tracks: [track]});
        if (await mopidyInstance.playback.getState() !== 'playing') {
            // @ts-ignore
            await mopidyInstance.playback.play();
        }
    }

    static async resume() {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.playback.resume();
    }

    static async pause() {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.playback.pause();

    }

    static async stop() {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.playback.stop();
    }

    static async getCurrentlyPlayingTrack() {
        const mopidyInstance = this.getMopidyInstance();
        return await mopidyInstance.playback.getCurrentTrack();
    }

    static async search(queryField, searchTerm) {
        const mopidyInstance = this.getMopidyInstance();
        return await mopidyInstance.library.search({query: {[queryField]: [searchTerm]}});
    }

    static async getImagesForTracks(tracks, callback) {
        const mopidyInstance = this.getMopidyInstance();
        if (tracks.length > 0) {
            const uris = tracks.map(track => track.uri);
            mopidyInstance.library
                .getImages({uris})
                .then((result) => callback(result));
        } else {
            callback([]);
        }
    }

    static async getListOfPlaylists() {
        const mopidyInstance = this.getMopidyInstance();
        await mopidyInstance.playlists.asList();
    }
}