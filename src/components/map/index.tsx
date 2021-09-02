import React from "react";
import L, {LatLngExpression} from "leaflet";
import {MapContainer, Marker, TileLayer, Tooltip,Popup} from "react-leaflet";
import {connect} from "react-redux";
import {setPlacePreviewVisibility, setSelectedPlace} from "src/utils/actions";
import {IState, Place} from "src/utils/types";
import AddMarker from "./addMarker";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import "./styles.css";


const Map = ({
                 isVisible,
                 places,
                 selectedPlace,
                 togglePreview,
                 setPlaceForPreview,
             }: any) => {
    const defaultPosition: LatLngExpression = [51.509865, -0.118092];
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    const showPreview = (place: Place) => {
        if (isVisible) {
            togglePreview(false);
            setPlaceForPreview(null);
        }

        if (selectedPlace?.title !== place.title) {
            setTimeout(() => {
                showPlace(place);
            }, 400);
        }
    };

    const showPlace = (place: Place) => {
        setPlaceForPreview(place);
        togglePreview(true);
    };

    return (
        <div className="map__container">
            <MapContainer
                center={defaultPosition}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100vh" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {places&&places?.map((place: Place) => (
                    <Marker
                        key={place.title}
                        position={place.position}
                        eventHandlers={{ click: () => showPreview(place) }}
                    >

                        <Popup className="popup__container">
                            <div>
                                <div className="popup__name">
                                    Name:{place.title}
                                </div>
                                <div  className="popup__name">
                                    Type:{place.type}
                                </div>
                            </div>
                            <div>
                                <img style={{width:200,height:100}} src={place.logo} />
                            </div>

                            <a href="#">more details</a>

                        </Popup>
                    </Marker>
                ))}
                <AddMarker />
            </MapContainer>
        </div>
    );
};

const mapStateToProps = (state: IState) => {
    const { places } = state;
    return {
        isVisible: places.placePreviewsIsVisible,
        places: places.places,
        selectedPlace: places.selectedPlace,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        togglePreview: (payload: boolean) =>
            dispatch(setPlacePreviewVisibility(payload)),
        setPlaceForPreview: (payload: Place) =>
            dispatch(setSelectedPlace(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
