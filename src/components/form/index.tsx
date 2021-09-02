import { connect } from "react-redux";
import { addNewPlace as addNewPlaceAction, setPlaceFormVisibility } from "src/utils/actions";
import { IState, Place } from "src/utils/types";
import { Field, Formik, Form as FormikForm,useFormik, FormikConfig } from "formik";
import Modal from 'react-modal';
import {LatLng, LatLngExpression} from "leaflet";
import "./styles.css";
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";
import AddMarker from "../map/addMarker";
import Camera from '../../assets/camera.png'
import React, {FormEvent, FormEventHandler, useState} from "react";

const Form = ({isVisible, position, closeForm, addNewPlace}: {
    isVisible: boolean;
    position: LatLng;
    closeForm: Function;
    addNewPlace: Function;
}) => {
    const [type,setType] = useState("Business")
    const [logo,setLogo] = React.useState("")
    const [name,setName] = useState("")

    const uploadFile = function (e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files;
        if (!file) return;
        setLogo(URL.createObjectURL(file[0]));
    };
    const handleOnSubmit = (values: PlaceFormProps|FormEventHandler<HTMLFormElement>|FormEvent<HTMLFormElement>) => {
        addNewPlace({
            preview:[position?.lat, position?.lng] ,
            title: name,
            type:type,
            logo:logo,
            position:[position?.lat, position?.lng]
        });
        setType('')
        setName('')
        setLogo('')
        closeForm()

    }

    return (
        <Modal isOpen={isVisible} shouldCloseOnOverlayClick ariaHideApp={false}>

            <div className={"form__container form__container--active"}>
                <div className="form__header">
        <span
            className="form__header__close"
            role="button"
            onClick={() => closeForm()}
        >
        </span>
                    <span className="form__header__title">Share Location</span>
                </div>
                <form onSubmit={handleOnSubmit}>

                    <div className="formGroup">
                        <div className="formGroupInput">
                            <label htmlFor="title">Location Name</label>
                            <input type='text' placeholder="" value={name} onChange={(e)=>setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="formGroup">
                        <div className="formGroupInput">
                            <label htmlFor="description">Location on Map</label>
                            <div style={{width:'350px', height:'100px'}}>
                                <MapContainer
                                    center={position}
                                    zoom={15}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%",width:'100%' }}
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker
                                        // key={}
                                        position={position}
                                    >
                                    </Marker>

                                    <AddMarker />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                    <div className="formGroup">
                        <div className="formGroupInput">
                            <label htmlFor="type">Location Type</label>
                            <select name="type" style={{height:"2rem"}} value={type} onChange={e=>setType(e.target.value)}>
                                <option value="Business">Business</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Public">Public</option>
                            </select>
                        </div>
                    </div>
                    <div className="formGroup">
                        <div className="formGroupInput">
                            <label htmlFor="link">Logo</label>
                            <div id="upload_button">
                                <label>
                                    <input type="file"  multiple onChange={uploadFile}/>
                                    {logo ? <img src={logo}/>:
                                        <img src={Camera}/>}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="holder__button">
                        <div className="button__container" style={{marginRight:'10px'}}>
                            <button className="form__button" type="submit" >Submit</button>
                        </div>
                        <div className="button__container">
                            <button className="form__button" onClick={()=>closeForm()} >cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const mapStateToProps = (state: IState) => {
    const { places } = state;
    return {
        isVisible: places.placeFormIsVisible,
        position: places.prePlacePosition as LatLng,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeForm: () =>
            dispatch(setPlaceFormVisibility(false)),

        addNewPlace: (place: Place) => {
            dispatch(addNewPlaceAction(place))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

interface PlaceFormProps {
    preview: LatLngExpression;
    title: string;
    type: string;
    logo: string;
}
