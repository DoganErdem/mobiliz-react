import React, {Component} from 'react';
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import axios from "axios";

class DeleteVehicle extends React.Component {

    deleteProduct = () => {
        const product = this.props.product;

        const url = "/vehicles/" + product.id;

        axios.delete(url, {
            auth: {
                username: "derdemkara@gmail.com",
                password: "12345"
            }
        }).then(res => {
                if (res.status === 200) {
                    console.log("response", res)
                    this.props.onHide();
                    this.props.deletedVehicle();
                }

            })


    }

    render() {
        const deleteProductDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text"
                        onClick={this.props.onHide}/>
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct}/>
            </React.Fragment>
        );
        return (
            <div>
                <Dialog visible={this.props.visible} style={{width: '450px'}} header="Confirm" modal
                        footer={deleteProductDialogFooter} onHide={this.props.onHide}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                        {this.props.product &&
                            <span>Are you sure you want to delete <b>{this.props.product.plate}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default DeleteVehicle;