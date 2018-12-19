import React from 'react';
import { Grid, GridColumn as Column, GridToolbar, GridDetailRow } from '@progress/kendo-react-grid';

import MyCommandCell from './my-command-cell.jsx';
import MyLinkCell from './my-link-cell.jsx';
import '@progress/kendo-theme-default/dist/all.css';
import ProductService from './services/product.js';

class App extends React.Component {

    CommandCell;
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        //!!!###$$$@@@
        this.props.auth.handleAuthentication();

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.enterInsert = this.enterInsert.bind(this);
        this.enterInsertLoginRequired = this.enterInsertLoginRequired.bind(this);
        this.itemChange = this.itemChange.bind(this);

        const enterEdit = this.enterEdit.bind(this);
        const save = this.save.bind(this);
        const cancel = this.cancel.bind(this);
        const remove = this.remove.bind(this);
        this.cancelCurrentChanges = this.cancelCurrentChanges.bind(this);
        this.CommandCell = MyCommandCell(enterEdit,remove,save,cancel, "inEdit");
    }

    componentDidMount() {
        this.getProductList();
        const { renewSession, isAuthenticated } = this.props.auth;

        if (localStorage.getItem('isLoggedIn') === 'true') {
          console.log('renewSession');
          renewSession();
        }
    }

    getProductList(){
        console.log('get products')
        ProductService.getProductList().then(res => {
            const data = res.data;
            this.setState({ data:data.slice() });
        })
    }

    expandChange = (event) => {
    	event.dataItem.expanded = !event.dataItem.expanded;
    	this.forceUpdate();
    }
    //click add button
    enterInsert() {
        const dataItem = { inEdit: true, isEdit: false, msds: '' };
        const newproducts = this.state.data.slice();
        this.update(newproducts, dataItem);
        this.setState({
            data: newproducts
        });
    }
    //click add button
    enterInsertLoginRequired() {
        if (this.props.auth.isAuthenticated()) {
            const dataItem = { inEdit: true, isEdit: false, msds: '' };
            const newproducts = this.state.data.slice();
            this.update(newproducts, dataItem);
            this.setState({
                data: newproducts
            });
        } else {
            alert('You have to login first');
        }
    }
    //click Edit button
    enterEdit(dataItem) {
        var objEdit = this.update(this.state.data, dataItem);
        objEdit.inEdit = true;
        objEdit.isEdit = true;
        this.setState({
            data: this.state.data.slice()
        });
    }

    save(dataItem, isEdit) {
        dataItem.inEdit = undefined;
        var obj = {
            "productId": dataItem.productId.toString(),
            "name": dataItem.name,
            "manufacturer": dataItem.manufacturer,
            "msds": dataItem.msds,
            "id": dataItem.id
        }
        if(isEdit){
            obj.productId = dataItem.productId;
            ProductService.updateProduct(obj)
            .then(res => {
                var that=this;
                setTimeout(function(){ that.getProductList(); }, 1000);

            })

        }else{
            ProductService.addProduct(obj)
            .then(res => {
               this.getProductList();
            })
        }
    }

    cancel(dataItem) {
        this.getProductList();
    }

    remove(dataItem) {
        dataItem.inEdit = undefined;
        var obj = {
            "id": dataItem.id
        };

        ProductService.deleteProduct(obj).then((response) => {
            this.getProductList();
        }).catch((error) => {
            console.log('error', error);
        })
    }

    cancelCurrentChanges(){
        const length = this.state.data.length;
        const data = this.state.data.slice(1,length);
        this.setState({
            data: data
        });

    }

    itemChange(event) {
        const value = event.value;
        const name = event.field;
        if (!name) {
            return;
        }
        const updatedData = this.state.data.slice();
        const item = this.update(updatedData, event.dataItem);
        item[name] = value;
        this.setState({
            data: updatedData
        });
    }

    update(data, item, remove) {
        let updated;
        let index = data.findIndex(p => p === item || (item.id && p.id === item.id));
        if (index >= 0) {
            updated = Object.assign({}, item);
            data[index] = updated;
        }
        else{
            let id = 1;
            data.forEach(p => {
                if(p.productId){
                    id = Math.max(parseInt(p.productId) + 1, id);
                }
            });
            updated = Object.assign({}, item, { productId: id });
            data.unshift(updated);
            index = 0;
        }

        if (remove) {
            data = data.splice(index, 1);
        }

        return data[index];
    }

    login() {
      this.props.auth.login();
    }

    logout() {
      this.props.auth.logout();
      this.setState({ data: [] });
    }

    render() {
      const { isAuthenticated } = this.props.auth;
        return (
            <div>
                <h1>ZESPRI</h1>

                {
              !isAuthenticated() && (
                <div>
                  <button onClick={this.login}>Login</button>
                  <Grid
                      style={{ height: 'fit-content' }}
                      onItemChange={this.itemChange}
                      editField="inEdit"
                      detail={DetailComponent}
                      expandField="expanded"
                      onExpandChange={this.expandChange}
                  >
                      <GridToolbar>
                          <button
                              title="Add new"
                              className="k-button k-primary"
                              onClick={this.enterInsertLoginRequired}
                          >Add new
                          </button>

                          {this.state.data.filter(p => p.inEdit).length > 0 && (
                              <button
                                  title="Cancel current changes"
                                  className="k-button"
                                  onClick={this.cancelCurrentChanges}
                              >Cancel current changes
                              </button>
                          )}
                      </GridToolbar>
                      <Column field="productId" title="Product ID" width="150px" editable={false} />
                      <Column field="name" title="Product Name" />
                      <Column field="manufacturer" title="Manufacturer"/>
                      <Column field="msds" cell={MyLinkCell} width="150px"/>
                      <Column cell={this.CommandCell} width="180px" />
                  </Grid>
                </div>
                )
            }
            {
              isAuthenticated() && (
                <div>
                  <button onClick={this.logout}>Logout</button>
                  <Grid
                      style={{ height: 'fit-content' }}
                      data={this.state.data}
                      onItemChange={this.itemChange}
                      editField="inEdit"
                      detail={DetailComponent}
                      expandField="expanded"
                      onExpandChange={this.expandChange}
                  >
                      <GridToolbar>
                          <button
                              title="Add new"
                              className="k-button k-primary"
                              onClick={this.enterInsertLoginRequired}
                          >Add new
                          </button>

                          {this.state.data.filter(p => p.inEdit).length > 0 && (
                              <button
                                  title="Cancel current changes"
                                  className="k-button"
                                  onClick={this.cancelCurrentChanges}
                              >Cancel current changes
                              </button>
                          )}
                      </GridToolbar>
                      <Column field="productId" title="Product ID" width="150px" editable={false} />
                      <Column field="name" title="Product Name" />
                      <Column field="manufacturer" title="Manufacturer"/>
                      <Column field="msds" cell={MyLinkCell} width="150px"/>
                      <Column cell={this.CommandCell} width="180px" />
                  </Grid>
                </div>
                )
            }
            </div>
        );
    }
}

class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return (
            <section>
                <p><strong>Product ID:</strong> {dataItem.productId} </p>
                <p><strong>Product Name:</strong> {dataItem.name} </p>
                <p><strong>Manufacturer:</strong> {dataItem.manufacturer} </p>
                <p><strong>MSDS:</strong> {dataItem.msds}</p>
            </section>
        );
    }
}

export default App;
