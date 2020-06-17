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
  query: Yup.string().required('Query is required'),
  markStrategy: Yup.number()
})

export const PageSpecForm = () => {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(0)
  const { currentUrl, tabId, addPageSpec, editPageSpec, deletePageSpec, currentPage, selectKey } = useContext(GlobalContext)

  useEffect(() => setQuery(currentPage.data && currentPage.data.query), [])

  useEffect(() => {
    if (!tabId) return
    applyTestQuery(tabId, query, response => setCount(response.count))
    return () => applyTestQuery(tabId, '')
  }, [query, tabId])

  const applyTestQuery = (tabId, query, callback) => {
    MessageRouter.sendMessageToTab(tabId, 'TEST_QUERY', query, response => {
      if (callback && response) callback(response)
    })
  }

  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt)
    if (!isValid) return
    const { pattern, query, markStrategy = 100 } = evt
    if (currentPage.data && currentPage.data.id) {
      editPageSpec({
        ...currentPage.data,
        pattern,
        query,
        markStrategy: markStrategy * 1
      })
    } else {
      addPageSpec({ pattern, query, markStrategy: markStrategy * 1 })
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

  const handlePatternChange = e => {
    setQuery(e.target.value)
  }

  return (
    <Formik
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={handleSubmit}
      initialValues={{
        pattern: currentPage.data ? currentPage.data.pattern : (currentUrl && currentUrl.toString()) || '',
        query: (currentPage.data && currentPage.data.query) || '',
        markStrategy: (currentPage.data && currentPage.data.markStrategy === 101) ? 101 : 100
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
                onBlur={handleBlur}
                isInvalid={!!errors.pattern}
              />
              <Form.Text className='text-muted'>
              </Form.Text>
              <Form.Control.Feedback type='invalid'>{errors.pattern}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md='4' controlId='validationFormik02'>
              <Form.Control
                type='text'
                placeholder='Query'
                name='query'
                value={values.query}
                onChange={(e) => { handleChange(e); handlePatternChange(e) }}
                onBlur={handleBlur}
                isInvalid={!!errors.query}
              />
              <Form.Text className='text-muted'>
                {(touched.query || !!values.query)
                  ? (<span>There are {(count > 0) ? (<b>{count}</b>) : 'no'} matches on the current page.</span>)
                  : (<span>Update the query to test it on the current page</span>)}
              </Form.Text>
              <Form.Control.Feedback type='invalid'>{errors.query}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md='4' controlId='validationFormik03'>
              <fieldset id='advanced-options'>
                <legend>Advanced Options</legend>
                <div className='section' style={{ display: 'none' }} />
                <div className='section'>
                  <span className='title'>Marking Items</span>
                  <Form.Check custom onChange={handleChange} defaultChecked={values.markStrategy === 100} id='radio4' type='radio' value='100' label='Mark items visited when scrolled into view' name='markStrategy' />
                  <Form.Check custom onChange={handleChange} defaultChecked={values.markStrategy === 101} id='radio3' type='radio' value='101' label='Mark items visited when the page loads' name='markStrategy' />
                </div>
              </fieldset>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Button type='submit' variant='dark'>Save</Button>
            {currentPage.data && currentPage.data.id &&
              <Button type='button' variant='danger' style={{ 'margin-left': '10px' }} onClick={handleDelete}>Delete</Button>}
            <Button type='button' variant='link' style={{ color: 'grey' }} onClick={handleCancel}>Cancel</Button>
          </Form.Row>
        </Form>
      )}
    </Formik>
  )
}
