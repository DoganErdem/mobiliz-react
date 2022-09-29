import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";
import NewVehicle from "./NewVehicle";
import DeleteVehicle from "./DeleteVehicle";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as vehicleActions from "../redux/actions/vehicleActions"

class Vehicle extends React.Component {

    emptyProduct = {
        id: null,
        plate: '',
        brand: '',
        model: null,
        modelYear: null,
        notes: '',
    }

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            product: this.emptyProduct,
            selectedProduct: null,
            editingRows: {},
            submitted: false,
            productDialog: false,
            deleteProductDialog: false,
        };
    }

    componentDidMount() {
        // this.getAllVehicle();
        this.props.actions.getAllVehicles();
        console.log("a", this.props.vehicles)
    }

    getAllVehicle = () => {
        // axios.get("/vehicles", {}, {
        //     auth: {
        //         username: "derdemkara@gmail.com",
        //         password: "12345"
        //     }
        // }).then(res => this.setState({products: res.data}))
        //     .catch(err => console.log(err))
       const response = this.props.actions.getAllVehicles();
       console.log("response", response)
       this.setState({products: response})

    }

    openNew = () => {
        this.setState({
            product: this.emptyProduct,
            submitted: false,
            productDialog: true
        });
    }

    hideDialog = () => {
        this.setState({
            submitted: false,
            productDialog: false
        });
    }

    hideDeleteProductDialog = () => {
        this.setState({deleteProductDialog: false});
    }

    confirmDeleteSelected = () => {
        this.setState({deleteProductDialog: true});
    }

    onRowEditComplete = (event) => {
        let {newData} = event;
        const body = {
            plate: newData.plate,
            modelId: 11,
            modelYear: newData.modelYear,
            notes: newData.notes,
            brand: newData.brand,
            model: newData.model
        }
        console.log("<<", body)
        axios.put("/vehicles/" + newData.id, body, {
            auth: {
                username: "derdemkara@gmail.com",
                password: "12345"
            }
        }).then(res => {
            if (res.status === 200) {
                this.createdVehicle(body);
            }
        })
    }

    textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    }

    render() {

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={this.openNew}/>
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger"
                            onClick={() => this.confirmDeleteSelected()} disabled={!this.state.selectedProduct}/>
                </React.Fragment>
            )
        }

        const footer = `In total there are ${this.props.vehicles ? this.props.vehicles.length : 0} products.`;

        return (
            <div>
                <Toast ref={(el) => this.toast = el}/>
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <div className="card">
                    <DataTable ref={(el) => this.dt = el} value={this.props.vehicles} editMode="row"
                               onRowEditComplete={this.onRowEditComplete}
                               selection={this.state.selectedProduct}
                               onSelectionChange={e => this.setState({selectedProduct: e.value})}
                               footer={footer} showGridlines scrollable scrollHeight="600px" responsiveLayout="scroll">
                        <Column selectionMode="single" style={{maxWidth: '3rem'}}
                                headerStyle={{width: "10px"}}></Column>
                        <Column field="plate" header="Plate" editor={(options) => this.textEditor(options)}
                                style={{width: '20%'}}></Column>
                        <Column field="brand" header="Brand" sortable style={{minWidth: '12rem'}}
                                editor={(options) => this.textEditor(options)} style={{width: '20%'}}></Column>
                        <Column field="model" header="Model" sortable style={{minWidth: '12rem'}}
                                editor={(options) => this.textEditor(options)} style={{width: '20%'}}></Column>
                        <Column field="modelYear" header="Model Year" sortable style={{minWidth: '12rem'}}
                                editor={(options) => this.textEditor(options)} style={{width: '20%'}}></Column>
                        <Column rowEditor headerStyle={{width: '10%', minWidth: '8rem'}}
                                bodyStyle={{textAlign: 'center'}}></Column>
                    </DataTable>
                </div>


                {this.state.productDialog && <NewVehicle
                    visible={this.state.productDialog}
                    hideDialog={this.hideDialog}
                    createdVehicle={() => {
                        this.toast.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Vehicle Created',
                            life: 3000
                        });
                        this.getAllVehicle();
                        this.hideDialog();
                    }}
                />}

                {
                    this.state.deleteProductDialog && <DeleteVehicle
                        visible={this.state.deleteProductDialog}
                        onHide={this.hideDeleteProductDialog}
                        product={this.state.selectedProduct}
                        deletedVehicle={() => this.getAllVehicle()}
                    />
                }

            </div>


        );
    }
}

function mapStateToProps(state){
    return {
        vehicles:state.vehicleReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getAllVehicles: bindActionCreators(vehicleActions.getAllVehicle, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vehicle);