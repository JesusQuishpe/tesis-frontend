import { createContext, forwardRef, useState, useEffect, useContext } from "react"
import OdontologyContext from "./OdontologyContext"

const OdontogramaContext = createContext()

const formatTeeth = (teethDetail) => {
  if (!teethDetail) return []
  return teethDetail.map(tooth => {
    return {
      top_side: tooth.top_side,
      right_side: tooth.right_side,
      left_side: tooth.left_side,
      bottom_side: tooth.bottom_side,
      center_side: tooth.center_side,
      symbo_path: tooth.symbologie ? tooth.symbologie.path : null,
      symb_id: tooth.symb_id,
      tooth_id: tooth.tooth_id,
      id: tooth.id
    }
  })
}

const formatMovilitiesRecessions = (movilitiesRecessions) => {
  if (!movilitiesRecessions) return []
  return movilitiesRecessions.map(mr => {
    return {
      type: mr.type,
      value: mr.value ? mr.value : "",
      pos: mr.pos,
      id: mr.id
    }
  })
}

const OdontogramaProvider = forwardRef(({ children }, ref) => {
  let { data } = useContext(OdontologyContext)
  const [optionSelected, setOptionSelected] = useState(null)
  const [editedTeeth, setEditedTeeth] = useState([])
  const [movilitiesRecessions, setMovilitiesRecessions] = useState(formatMovilitiesRecessions(data?.odontogram?.movilities_recessions))
  const [odontogramImageFile, setOdontogramImageFile] = useState(null)
  const [isOdontogramEmpty, setIsOdontogramEmpty] = useState(true)

  const updateOption = (params) => {
    setOptionSelected(params)
  }

  const updateTooth = (tooth) => {
    const copy = [...editedTeeth]
    const toothIndex = copy.findIndex(copyTooth => copyTooth.tooth_id === tooth.tooth_id)
    console.log(toothIndex);
    if (toothIndex > -1) {
      copy.splice(toothIndex, 1, tooth)
    } else {
      copy.push(tooth)
    }
    setEditedTeeth(copy)
  }

  const updateMovilitiesRecessions = (params) => {
    const copy = [...movilitiesRecessions]
    const index = copy.findIndex(copyMR => copyMR.pos === params.pos)
    if (index > -1) {
      copy.splice(index, 1, params)
    } else {
      copy.push(params)
    }
    setMovilitiesRecessions(copy)
  }

  const hasSomeItem = (tooth) => {
    //Si est?? en blanco quiere decir que no hay ningun lado pintado
    if (tooth.top_side !== ""
      || tooth.right_side !== ""
      || tooth.left_side !== ""
      || tooth.bottom_side !== ""
      || tooth.center_side !== ""
      || tooth.symbo_path !== ""
    ) {
      return true
    }
    return false
  }

  const getAcceptedTeeth = () => {
    const newTeeth = []
    editedTeeth.forEach(tooth => {
      if (hasSomeItem(tooth)) {
        newTeeth.push(tooth)
      }
    });
    return newTeeth
  }

  const getAcceptedMovilitiesRecessions = () => {
    const newMovilitiesRecessions = []
    movilitiesRecessions.forEach(mr => {
      if (mr.value !== "") {
        newMovilitiesRecessions.push(mr)
      }
    });
    return newMovilitiesRecessions
  }

  useEffect(() => {
    console.log(editedTeeth);
    if (editedTeeth.length > 0 || movilitiesRecessions.length > 0) {
      setIsOdontogramEmpty(false)
    } else {
      setIsOdontogramEmpty(true)
    }
  }, [editedTeeth, movilitiesRecessions])

  useEffect(() => {
    setEditedTeeth(formatTeeth(data?.odontogram?.teeth))
  }, [data])

  return (
    <OdontogramaContext.Provider value={{
      id: data?.odontogram?.id || null,
      teeth: data?.teeth,
      optionSelected,
      editedTeeth,
      movilitiesRecessions,
      odontogramImageFile,
      isOdontogramEmpty,
      updateOption,
      updateTooth,
      getAcceptedTeeth,
      getAcceptedMovilitiesRecessions,
      updateMovilitiesRecessions,
    }}>{children}
    </OdontogramaContext.Provider>
  )
})

export default OdontogramaContext;
export { OdontogramaProvider };