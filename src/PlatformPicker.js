import React from 'react';
import { platformIcons } from "./Utils";

export const plats = {
    "all": "All",
    "3ds": "3DS",
    "switch": "Switch",
    "wiiu": "Wii U",
};

const PlatformPicker = ({path = ""}) => {
    const platformSelect = (Object.keys(plats)).map(plat => {
        return (
            <a href={`/${plat}${path}`} className="platChooser">
                <div>
                    <img style={{width: 100}} src={platformIcons[plat]} alt={plats[plat]} />
                    <h3>{plats[plat]}</h3>
                </div>
            </a>
        );
    });
    return (<div style={{width: 500, maxWidth: "100%", margin: "0 auto", marginTop: 40}}>
        <h2 style={{fontSize: 18, padding: 5, backgroundColor: "unset", textAlign: "center"}}>Choose a Platform</h2>
        <div style={{display: "flex"}} id="platChooserList">{ platformSelect }</div>
    </div>);
};

export default PlatformPicker;
