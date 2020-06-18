import React, {Component} from 'react';
import './CopyToClipboard.css';
import { Input, Button, Typography, Alert} from 'antd';

const { Title } = Typography;


class CopyToClipboard extends Component{
    constructor(props){
        super(props);
        this.state={
            linkToCopy: window.location,
            showConfirm: false,
        }
    }
    handelCopy=()=> {
        /* Get the text field */
        var copyText = document.getElementById("myInput");

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        this.setState({
            ...this.state,
            showConfirm: true
        });

        setTimeout(function(){
            this.setState({
                ...this.state,
                showConfirm: false
            })
        }.bind(this),2000);
    };

    render() {
        return(
            <>
                {this.state.showConfirm ? <Alert banner="true" message="Coped To Clipboard Successfully!" type="success" showIcon /> : ""}
            <Title level={4} className="turnName">Share Game Link To play with friends</Title>
            <Input
                id="myInput"
                value={this.state.linkToCopy}
        placeholder="input search text"
                addonAfter={<Button onClick={this.handelCopy}>Copy</Button>}
            />

        </>
        )
    }

}

export default CopyToClipboard;


