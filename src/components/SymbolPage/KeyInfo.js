import React from "react";
import PropTypes from "prop-types";
import {SymbolCardGroup} from "./symbol-cardgroup";

const KeyInfo = ({keyData, keyDataLabel, symbol}) => {

    let cardData = [{
        title: '',
        data: [
            {title:keyDataLabel[0], value: keyData[0]},
            {title:keyDataLabel[5], value: keyData[5]},
            {title:keyDataLabel[1], value: keyData[1]},
        ]
    },{
        title: '',
        data: [
            {title:keyDataLabel[2], value: keyData[2]},
            {title:keyDataLabel[3], value: keyData[3]},
            {title:keyDataLabel[4], value: keyData[4]},
        ]
    }];

    return (
        keyDataLabel[0] ? <SymbolCardGroup title="Key Informations"
                         symbol={symbol}
                         cardData={cardData}
                         prefetched={true}
        />: null
    );
}


/*<h3>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g>
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path
                            d="M12 22C6.477 22 2 17.523 2 12c0-4.478 2.943-8.268 7-9.542v2.124A8.003 8.003 0 0 0 12 20a8.003 8.003 0 0 0 7.418-5h2.124c-1.274 4.057-5.064 7-9.542 7zm9.95-9H11V2.05c.329-.033.663-.05 1-.05 5.523 0 10 4.477 10 10 0 .337-.017.671-.05 1zM13 4.062V11h6.938A8.004 8.004 0 0 0 13 4.062z"/>
                    </g>
                </svg>
                {" "}
            </h3>*/

KeyInfo.propTypes = {
  keyData: PropTypes.array,
  keyDataLabel: PropTypes.array,
};

export default KeyInfo;
