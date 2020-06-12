/* global chrome */

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

  useEffect(() => setQuery(currentPage.data && currentPage.data.query), [])

  useEffect(() => {
    if (!tabId) return
    MessageRouter.sendMessageToTab(tabId, 'TEST_MATCH_PATTERN', query, (response) => {
      if (!response) return
      setCount(response.count)
    })
  }, [query, tabId])

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

  const handlePatternChange = e => {
    setQuery(e.target.value)
  }

  const openUrl = url => {
    const popup = chrome.extension.getViews({ type: 'popup' })[0]
    popup && popup.close()
    chrome.tabs.create({ url })
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
                onBlur={handleBlur}
                isInvalid={!!errors.pattern}
              />
              <Form.Text className='text-muted'>
                Format: <a href='https://developer.chrome.com/extensions/match_patterns' onClick={e => openUrl(e.target.href)}>https://developer.chrome.com/extensions/match_patterns</a>
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
          <Button type='submit' variant='dark'>Save</Button>
          {currentPage.data && currentPage.data.id &&
            <Button type='button' variant='danger' style={{ 'margin-left': '10px' }} onClick={handleDelete}>Delete</Button>}
          <Button type='button' variant='link' style={{ color: 'grey' }} onClick={handleCancel}>Cancel</Button>
        </Form>
      )}
    </Formik>
  )
}
