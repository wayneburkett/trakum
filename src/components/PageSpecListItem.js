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
    <li><button onClick={handleEditOnClick}><EditIcon /></button> {pageSpec.pattern}</li>
  )
}

