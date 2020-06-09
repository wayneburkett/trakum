import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { FiEdit as EditIcon } from "react-icons/fi";

export const PageSpecListItem = ({ pageSpec }) => {
  const { selectKey } = useContext(GlobalContext)

  const handleEditOnClick = (e) => {
    e.preventDefault()
    selectKey('edit', pageSpec)
  }

  return (
    <tr>
      <td className="align-middle">
        <button className='edit-button' onClick={handleEditOnClick}><EditIcon /></button>
      </td>
      <td className="align-middle">{pageSpec.pattern}</td>
    </tr>
  )
}

