import React from 'react'
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import axios from "axios";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";

class NewVehicle extends React.Component {

    state = {
        product: {
            plate: '',
            modelYear: undefined,
            notes: '',
            modelId: null
        },
        brands: null,
        selectedBrands: null,
        models: null,
        selectedModel: null,
    }

    findUnique = (arr, predicate) => {
        let found = {};
        arr.forEach(d => {
            found[predicate(d)] = d;
        });
        return Object.keys(found).map(key => found[key]);
    }

    componentDidMount() {
        axios.get("/models", {}, {
            auth: {
                username: "derdemkara@gmail.com", password: "12345"
            }
        }).then(res => {
            const brands = this.findUnique(res.data, d => d.brand)
            this.setState({brands})
        })
            .catch(err => console.log(err))
    }

    saveProduct = () => {
        const product = {...this.state.product};

        const body = {
            plate: product.plate,
            modelId: this.state.selectedModel.id,
            modelYear: product.modelYear,
            notes: product.notes,

        }
        console.log("bod", body)
        axios.post("/vehicles", body).then(res => {
            if (res.status === 200) {
                this.props.createdVehicle();
            }
        })
    }

    onInputChange = (e, name) => {
        let val = '';
        if (name === "modelYear") val = e.value || 0; else val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({product});
    }

    selectedBrand = (event) => {
        this.setState({selectedBrands: event.value})

        this.getAllModels(event.value)
    }

    getAllModels = (brand) => {
        axios.get("/models/brand/" + brand.brand, {}, {
            auth: {
                username: "derdemkara@gmail.com",
                password: "12345"
            }
        }).then(res => {
            this.setState({models: res.data})
        })
            .catch(err => console.log(err))
    }

    render() {
        const productDialogFooter = (<React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.props.hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveProduct}/>
        </React.Fragment>);

        return (<div>
            <Toast ref={(el) => this.toast = el}/>
            <Dialog visible={this.props.visible} style={{width: '450px'}} header="Vehicle Details" modal
                    className="p-fluid" footer={productDialogFooter} onHide={this.props.hideDialog}>

                <div className="field">
                    <label htmlFor="plate">Plate</label>
                    <InputText id="plate" value={this.state.product.plate}
                               onChange={(e) => this.onInputChange(e, 'plate')} required autoFocus
                               className={classNames({'p-invalid': this.state.submitted && !this.state.product.plate})}/>
                    {this.state.submitted && !this.state.product.plate &&
                        <small className="p-error">Plate is required.</small>}
                </div>


                <div className="field">
                    <label htmlFor="brand">Brand</label>
                    <Dropdown value={this.state.selectedBrands} options={this.state.brands}
                              onChange={(e) => this.selectedBrand(e)} optionLabel="brand"
                              placeholder="Select a Brand"/>
                </div>

                <div className="field">
                    <div className="field">
                        <label htmlFor="model">Model</label>
                        <Dropdown value={this.state.selectedModel} options={this.state.models}
                                  onChange={(e) => this.setState({selectedModel: e.value})} optionLabel="model"
                                  placeholder="Select a Model"/>
                    </div>
                    <div className="field">
                        <label htmlFor="modelYear">Model Year</label>
                        <InputNumber id="modelYear" mode="decimal" useGrouping={false}
                                     value={this.state.product.modelYear}
                                     onValueChange={(e) => this.onInputChange(e, 'modelYear')}/>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="notes">Notes</label>
                    <InputTextarea id="notes" value={this.state.product.notes}
                                   onChange={(e) => this.onInputChange(e, 'notes')} required rows={3} cols={20}/>
                </div>
            </Dialog>
        </div>)
    }
}

export default NewVehicle;