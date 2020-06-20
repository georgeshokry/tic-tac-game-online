import React, {Component} from 'react';
import { Row } from 'antd';
import Square from './Square';
import './Board.css';

class Board extends Component{
    renderSquares(position){
        return <Square
            value={this.props.squares[position]}
            onClick={()=>{this.props.onClick(position)}}
        />
    }

    render() {
        return (

            <Row className="box" justify="space-around">
            <div className="square-back">
                <div className="content">
                    {this.renderSquares(0)}
                </div>
            </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(1)}
                    </div>
                </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(2)}
                    </div>
                </div>
            <div className="square-back">
            <div className="content">
                    {this.renderSquares(3)}
            </div>
            </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(4)}
                    </div>
                </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(5)}
            </div>
            </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(6)}
                    </div>
                </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(7)}
                    </div>
                </div>
                <div className="square-back">
                    <div className="content">
                    {this.renderSquares(8)}
                    </div>
                        </div>
            </Row>

        )
    }
}

export default Board;