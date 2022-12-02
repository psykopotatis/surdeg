import React from 'react';
import './Header.less';


export default class extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm mt-5 mb-3">
                        <h1>Baka surdeg</h1>
                        <div className="alert alert-success" role="alert">
                            <strong>Hey!</strong> Här kan du beräkna hydreringen på ditt surdegsbröd.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}