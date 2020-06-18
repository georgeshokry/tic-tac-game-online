import React, {Component} from 'react';
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
            <React.Fragment>
                <div className="border-row">
                    {this.renderSquares(0)}
                    {this.renderSquares(1)}
                    {this.renderSquares(2)}
                </div>
                <div className="border-row">
                    {this.renderSquares(3)}
                    {this.renderSquares(4)}
                    {this.renderSquares(5)}
                </div>
                <div className="border-row">
                    {this.renderSquares(6)}
                    {this.renderSquares(7)}
                    {this.renderSquares(8)}
                </div>
            </React.Fragment>

        )
    }
}

export default Board;