const initialState = {
    selectedTrackDivToAnchorOn: null,
    currentlyViewingIndex: null,
    tracks: [],
    images: {},
};

export default function searchResultsReducer(state = initialState, action) {
    switch (action.type) {
        case 'searchResults/setSearchResults':
            return {
                ...state,
                tracks: action.payload.tracks,
                images: action.payload.images,
            }
        case 'searchResults/actOnSearchResult':
            return {
                ...state,
                selectedTrackDivToAnchorOn: action.payload.selectedTrackDivToAnchorOn,
                currentlyViewingIndex: action.payload.currentlyViewingIndex,
            }
        default:
            return state
    }
}