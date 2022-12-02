<div className="save-section py-5">
    <div className="row pb-3">
        <div className="col-sm">
            <p><i className="far fa-save"/> <strong>Best recipe? Save it!</strong></p>
            <label htmlFor="nameInput">Name:</label>
            <div className="input-group mb-3">
                <input type="text"
                       className="form-control"
                       id="nameInput"
                       value={this.state.name}
                       onChange={this.onNameInputChange}
                />
            </div>
            <button type="button"
                    onClick={this.handleSave}
                    className="btn btn-primary saveButton">Save recipe!
            </button>
        </div>
    </div>
    {this.state.saveResult &&
        <div className="row">
            <div className="col-sm">
                <div className="alert alert-success" role="alert">
                    <strong>{this.state.saveResult}</strong> {this.state.redirectUrl}
                </div>
            </div>
        </div>
    }
</div>