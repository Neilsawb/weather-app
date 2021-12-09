import React, { Component} from 'react';

class Weatherparameter extends Component {
    render() {
        return (
            <div
                style={{
                    border:"2px solid white",
                    padding: "20px",
                    height:"360",
                    width:"360",
                    borderRadius:"50%",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                }}
            >
                {this.props.children !== null ? this.props.children :"-" } {this.props.unit}
            </div>    
        )
    }
}

export default Weatherparameter;