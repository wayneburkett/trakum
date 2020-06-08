import React from 'react'
import { FiEdit as EditIcon, FiDelete as DeleteIcon } from "react-icons/fi";

export const PageSpecListItem = ({ pageSpec }) => {
  return (
    <li><EditIcon /> <DeleteIcon /> {pageSpec.pattern}</li>
  )
}

