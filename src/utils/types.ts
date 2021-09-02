import { LatLngExpression } from "leaflet";

export interface SearchState {
    searchIsVisible: boolean;
}

export interface PlaceState {
    places: Place[];
    selectedPlace: Place | null;
    placePreviewsIsVisible: boolean;
    placeFormIsVisible: boolean;
    prePlacePosition: LatLngExpression;
}

export interface IState {
    search: SearchState;
    places: PlaceState;
}

export interface Place {
    preview: LatLngExpression;
    title: string;
    type: string;
    logo: string;
    position: LatLngExpression;
}
