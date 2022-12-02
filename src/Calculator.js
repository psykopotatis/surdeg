import React, {Component} from 'react';
import './Calculator.css'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import map from 'lodash/map';
import each from 'lodash/each';
import clone from 'lodash/clone';
import axios from 'axios';


class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            flour: {
                name: 'Flour',
                weight: 1000,
                percent: 100,
                selected: true
            },
            ingredients: {
                water: {
                    name: 'Water',
                    weight: 800,
                    percent: 80,
                    selected: true
                },
                milk: {
                    name: 'Milk',
                    weight: 0,
                    percent: 0,
                    selected: false
                },
                yoghurt: {
                    name: 'Yoghurt',
                    weight: 0,
                    percent: 0,
                    selected: false
                },
                sourdough: {
                    name: 'Sourdough starter',
                    weight: 150,
                    percent: 15,
                    selected: true
                },
                butter: {
                    name: 'Butter',
                    weight: 0,
                    percent: 0,
                    selected: false
                },
                salt: {
                    name: 'Salt',
                    weight: 20,
                    percent: 2,
                    selected: true
                },
                sugar: {
                    name: 'Sugar',
                    weight: 0,
                    percent: 0,
                    selected: false
                },

            },
            showModal: false,
            saveResult: null,
            redirectUrl: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.onFlourInputChange = this.onFlourInputChange.bind(this);
        this.calculatePercentToWeight = this.calculatePercentToWeight.bind(this);
        this.calculateWeightToPercent = this.calculateWeightToPercent.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderCheckboxes = this.renderCheckboxes.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.getDoughTotal = this.getDoughTotal.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onNameInputChange = this.onNameInputChange.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.calculateGrams();
    };

    calculateGrams() {

    };

    calculatePercentToWeight(event) {
        const percent = parseInt(event.target.value) || 0;
        let weight = this.round(this.state.flour.weight * (percent / 100));
        const key = event.target.name.replace('Percent', '');

        let ingredients = Object.assign({}, this.state.ingredients);
        ingredients[key].weight = weight;
        ingredients[key].percent = percent;

        this.setState(ingredients);
    };

    calculateWeightToPercent(event) {
        const weight = parseInt(event.target.value) || 0;
        let percent = this.round((weight / this.state.flour.weight) * 100);
        const key = event.target.name;

        let ingredients = Object.assign({}, this.state.ingredients);
        ingredients[key].weight = weight;
        ingredients[key].percent = percent;

        this.setState(ingredients);
    };

    round(n) {
        if (this.isFloat(n)) {
            return n.toFixed(1);
        }

        return n;
    };

    isFloat(n) {
        return n % 1 !== 0;
    };

    onFlourInputChange(event) {
        const flour = parseInt(event.target.value) || 0;

        let ingredients = Object.assign({}, this.state.ingredients);
        each(ingredients, (val, key) => {
            val.weight = this.round(flour * (val.percent / 100));
        });

        this.setState({
                flour: {
                    weight: flour,
                    percent: 100,
                    selected: true
                },
                ingredients
            }
        );

    };

    handleFocus(event) {
        event.target.select();
    };

    handleShow() {
        this.setState({
            showModal: true
        })
    };

    handleClose() {
        this.setState({
            showModal: false
        })
    };

    renderRow(ingredient, ingredientKey) {
        if (!ingredient.selected) {
            return null;
        }

        return (
            <React.Fragment key={ingredientKey}>
                <div className="row">
                    <div className="col-sm">
                        <label className="calculator-label"
                               htmlFor={ingredientKey + "PercentInput"}>{ingredient.name}</label>
                    </div>
                </div>

                <div className="row input-row mb-3">
                    <div className="col-sm first-col">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input type="text"
                                       value={ingredient.percent}
                                       onFocus={this.handleFocus}
                                       onChange={this.calculatePercentToWeight}
                                       className="form-control form-control-lg"
                                       name={ingredientKey + "Percent"}
                                       id={ingredientKey + "PercentInput"}
                                />
                                <p>%</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input type="text"
                                       value={ingredient.weight}
                                       onFocus={this.handleFocus}
                                       onChange={this.calculateWeightToPercent}
                                       className="form-control form-control-lg"
                                       name={ingredientKey}
                                       id={ingredientKey + "Input"}
                                />
                                <p>g</p>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    renderCheckboxes(ingredient, ingredientKey) {
        return (
            <React.Fragment key={ingredientKey + ingredient.weight}>
                <div className="custom-control custom-checkbox checkbox-lg">
                    <input type="checkbox"
                           name={ingredientKey}
                           className="custom-control-input"
                           id={ingredientKey}
                           onChange={this.onCheckboxChange}
                           checked={this.state.ingredients[ingredientKey].selected}
                    />
                    <label className="custom-control-label" htmlFor={ingredientKey}>{ingredient.name}</label>
                </div>
            </React.Fragment>
        );
    };

    onCheckboxChange(event) {
        let ingredients = Object.assign({}, this.state.ingredients);
        const ingredientKey = event.target.name;
        ingredients[ingredientKey].selected = !ingredients[ingredientKey].selected;

        this.setState(ingredients);
    };

    getDoughTotal() {
        let total = parseInt(this.state.flour.weight);
        each(this.state.ingredients, (val, key) => {
            if (val.selected) {
                total = total + parseInt(val.weight);
            }
        });
        return total;
    };

    handleSave(event) {
        console.log('handleSave');
        const ingredients = clone(this.state.ingredients);
        ingredients['flour'] = this.state.flour;
        ingredients['flour']['name'] = 'Flour';
        console.log(this.state.name);
        console.table(ingredients);

        axios.post('/save', {
            name: this.state.name,
            ingredients: ingredients
        }).then((response) => {
            // handle success
            // data:
            // result: "ok"
            // url: "/recipe/25/sdf"
            console.log(response);
            console.log(response.data.result);
            console.log(response.data.result === "ok");
            console.log(response.data.url);
            if (response.data.result === "ok") {
                this.setState({
                    saveResult: 'Ok!',
                    redirectUrl: 'Redirecting to: ' + response.data.url
                });

                console.log('redirecting to: ' + response.data.url);
                console.log('in 3 seconds ...');

                setTimeout(function () {
                    console.log('ok');
                    window.location.replace(response.data.url);
                }, 3000);
            }
        })
            .catch((error) => {
                // handle error
                console.log(error);
                this.setState({
                    saveResult: error
                });
            });
    };

    onNameInputChange(event) {
        this.setState({
                name: event.target.value
            }
        );

    };

    render() {
        return (
            <React.Fragment>
                <div className="mb-4">
                    <form id="calculatorForm">
                        <div className="row">
                            <div className="col-sm">
                                <label className="calculator-label"
                                       htmlFor="flourInput">Flour</label>
                            </div>
                        </div>

                        <div className="row input-row mb-3">
                            <div className="col-sm first-col">
                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <input type="text"
                                               value={this.state.flour.weight}
                                               onFocus={this.handleFocus}
                                               onChange={this.onFlourInputChange}
                                               className="form-control form-control-lg"
                                               name="flour"
                                               id="flourInput"
                                        />
                                        <p>g</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm">

                            </div>
                        </div>
                        {map(this.state.ingredients, this.renderRow)}
                    </form>
                </div>

                <div className="row mb-5">
                    <div className="col-sm">
                        <Button variant="primary" onClick={this.handleShow}>
                            Change ingredients
                        </Button>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col">
                        <p><strong>Weight</strong></p>
                        <p>Your dough weighs <strong>{this.getDoughTotal()} grams</strong>. You can make <strong>two
                            loaves</strong> that weigh <strong>{this.getDoughTotal() / 2} grams</strong> each.</p>
                    </div>
                </div>

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

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change ingredients</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="custom-control custom-checkbox checkbox-lg">
                                <input type="checkbox"
                                       name="flourCheckbox"
                                       className="custom-control-input"
                                       id="flourCheckbox"
                                       checked
                                       disabled
                                />
                                <label className="custom-control-label"
                                       htmlFor="flourCheckbox">Flour</label>
                            </div>
                            {map(this.state.ingredients, this.renderCheckboxes)}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Calculator;