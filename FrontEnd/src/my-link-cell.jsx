import React from 'react';

export default class MyLinkCell extends React.Component {
    handleChange = (e) => {
        this.props.onChange({
            dataItem: this.props.dataItem,
            field: this.props.field,
            syntheticEvent: e.syntheticEvent,
            value: e.target.value
        });
    }

    render() {
        const dataValue = this.props.dataItem[this.props.field];
        return !this.props.dataItem.inEdit
            ?
            dataValue ? (
                <td>
                    <a style={{ display: "table-cell" }} href={dataValue} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-link icon-link"></i>
                    </a>
                </td>
            ) : (<td></td>)

            : (
                <td>
                    <input className="k-textbox input-link" type="text" disabled value={dataValue} />
                </td>
            );
    }
};