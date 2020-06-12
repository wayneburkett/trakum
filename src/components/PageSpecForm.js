import React, { useContext, useState, useEffect } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as Yup from 'yup'
import { MatchPattern } from '../util/MatchPattern'
import { MessageRouter } from '../util/MessageRouter'
import { GlobalContext } from '../context/GlobalState'

const schema = Yup.object({
  pattern: Yup.string().matches(MatchPattern.MATCH_PATTERN_REGEX).required('Match pattern is required'),
  query: Yup.string().required('Query is required')
})

export const PageSpecForm = () => {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(0)
  const { currentUrl, tabId, addPageSpec, editPageSpec, deletePageSpec, currentPage, selectKey } = useContext(GlobalContext)

  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt)
    if (!isValid) return
    const { pattern, query } = evt
    if (currentPage.data && currentPage.data.id) {
      editPageSpec({
        ...currentPage.data,
        pattern,
        query
      })
    } else {
      addPageSpec({ pattern, query })
    }
  }

  const handleCancel = e => {
    selectKey('all')
  }

  const handleDelete = e => {
    if (window.confirm('Delete this page spec?')) {
      deletePageSpec(currentPage.data)
    }
  }

  useEffect(() => {
    if (!tabId) return
    MessageRouter.sendMessageToTab(tabId, 'TEST_MATCH_PATTERN', query, (response) => {
      if (!response) return
      setCount(response.count)
    })
  }, [query, tabId])

  const handlePatternChange = e => {
    setQuery(e.target.value)
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        pattern: currentPage.data ? currentPage.data.pattern : (currentUrl && currentUrl.toString()),
        query: currentPage.data && currentPage.data.query
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isInvalid,
        errors
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md='4' controlId='validationFormik01'>
              <Form.Control
                type='text'
                placeholder='Match pattern'
                name='pattern'
                value={values.pattern}
                onChange={handleChange}
                isInvalid={!!errors.pattern}
              />
              <Form.Control.Feedback type='invalid'>{errors.pattern}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md='4' controlId='validationFormik02'>
              <Form.Control
                type='text'
                placeholder='Query'
                name='query'
                value={values.query}
                onChange={(e) => { handleChange(e); handlePatternChange(e) }}
                isInvalid={!!errors.query}
              />
              <Form.Text className='text-muted'>
              There are {(count > 0) ? count : 'no'} matches on the current page.
              </Form.Text>
              <Form.Control.Feedback type='invalid'>{errors.query}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type='submit' variant='dark'>Save</Button>
          {currentPage.data && currentPage.data.id &&
            <Button type='button' variant='danger' style={{ 'margin-left': '10px' }} onClick={handleDelete}>Delete</Button>}
          <Button type='button' variant='link' style={{ color: 'grey' }} onClick={handleCancel}>Cancel</Button>
        </Form>
      )}
    </Formik>
  )
}
