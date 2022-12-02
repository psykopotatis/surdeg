import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Calculator from "./Calculator";
import './index.css'

function App() {
    return (
        <Calculator/>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
