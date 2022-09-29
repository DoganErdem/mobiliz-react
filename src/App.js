import React from 'react';
import Vehicle from "./vehicle/Vehicle";
import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";
class App extends React.Component{
    render(){
        return (
            <div>
                <Vehicle />
            </div>
        );
    }

}

export default App;
