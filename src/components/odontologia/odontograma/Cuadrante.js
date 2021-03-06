import OdontogramaContext from 'contexts/OdontogramaContext';
import React, { useContext } from 'react';
import Diente from './Diente';


const Cuadrante = ({ quadrant, teeth, reverse, details}) => {
  const { optionSelected, updateTooth } = useContext(OdontogramaContext)
  console.log(details);
  
  return (
    <div id={`cuadrante-${quadrant}`} className='cuadrante'>
      {
        teeth.map((tooth, index) => {
          let toothFinded = details.find(toothDetail => toothDetail.tooth_id === tooth.id)
          let toothData = {
            id: toothFinded?.id || null,
            tooth_id: tooth.id,
            type: tooth.type,
            dental_piece: tooth.dental_piece,
            teeth_num: tooth.teeth_num,
            top_side: toothFinded?.top_side || "",
            right_side: toothFinded?.right_side || "",
            left_side: toothFinded?.left_side || "",
            bottom_side: toothFinded?.bottom_side || "",
            center_side: toothFinded?.center_side || "",
            symbo_path: toothFinded?.symbo_path || null,
            symb_id: toothFinded?.symb_id || null,
          }
          if ((quadrant === 5 || quadrant === 8) && index === 0) {
            return (
              <div style={{ gridColumnStart: 4 }} key={tooth.id}>
                <Diente
                  key={tooth.id}
                  tooth={toothData}
                  reverse={reverse}
                  optionSelected={optionSelected}
                  updateTooth={updateTooth}
                />
              </div>
            )
          }
          return (
            <Diente
              key={tooth.id}
              tooth={toothData}
              reverse={reverse}
              optionSelected={optionSelected}
              updateTooth={updateTooth}
            />
          )
        })
      }
    </div>
  )
};
export default React.memo(Cuadrante)
