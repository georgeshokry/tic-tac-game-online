import React, {Component} from 'react';
import {Modal, Button, Form, Input, InputNumber} from 'antd';
import { Redirect } from "react-router-dom";
import * as firebase from 'firebase';


const closeable= false;
const visible = true;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const validateMessages = {
    required: 'required!',
    range: 'must be between 3 and 5',

};
class NameModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userName: '',
            scoreLimit: "",
        };
    }
    componentDidMount() {

        // const itemsRef = firebase.database().ref('data');
        // itemsRef.on('value', (snapshot) => {
        //     console.log("firebase:",snapshot.val());
        //
        // });
    }
     onFinish = values => {


        console.log(this.state.scoreLimit);


         const postData =  {
             username: values.usernameX,
             playArray: Array(9).fill(""),
             nextPlayer: values.usernameX,
             contender:{username: values.usernameO},
             X: values.usernameX,
             O: values.usernameO,
             whoWins: "",
             xIsNext: true,
             // scoreLimit: this.state.ScoreLimit
         };

         const newPostKey = firebase.database().ref().child('playXo').push().key;

         const updates = {};
         updates['/playXo/' + newPostKey] = postData;

         firebase.database().ref().update(updates).catch((error)=>{
             console.log(error);
         });

        this.setState({
            ...this.state,
            showModal: false,
            userName: values.username,
            uid: newPostKey
        });

        console.log('Success:', values.username);
    };

     onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    // setScoreLimit = (value)=>{
    //   this.setState({
    //       ...this.state,
    //       scoreLimit: value
    //   })
    // };
    render() {

        if (this.state.userName === '') {

            return (<Modal
                title="Create new Game"
                visible={visible}
                closable={closeable}

                // confirmLoading={confirmLoading}
                footer={[]}
            >
                <Form
                    {...layout}
                    name="basic"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="Username X"
                        name="usernameX"
                        rules={[
                            {
                                required: true,
                                min: 3,
                                max: 10,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Username O"
                        name="usernameO"
                        rules={[
                            {
                                required: true,
                                min: 3,
                                max: 10,
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    label="Score Limit"*/}
                    {/*    name="scoreLimit"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: true,*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <InputNumber min={3} max={50} initialValues={3} value={this.state.scoreLimit} onChange={this.setScoreLimit} />*/}
                    {/*</Form.Item>*/}

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" block>
                            Start Game
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>)
        } else {
            return (<Redirect to={`/play/${this.state.uid}`}/>)
        }
    }
}

export default NameModal;