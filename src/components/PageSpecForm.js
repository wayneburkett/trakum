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

function PageSpecForm() {
  const [query, setQuery] = useState("")
  const { currentUrl, tabId, addPageSpec } = useContext(GlobalContext)

  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt)
    if (!isValid) return
    addPageSpec(evt)
  }

  useEffect(() => {
    if (!tabId || !query || query.length <= 0) return
    MessageRouter.sendMessageToTab(tabId, 'TEST_MATCH_PATTERN', query, (response) => {
      console.log(response)
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
        pattern: currentUrl && currentUrl.toString()
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isInvalid,
        errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md="4" controlId="validationFormik01">
              <Form.Control
                type="text"
                placeholder="Match pattern"
                name="pattern"
                value={values.pattern}
                onChange={handleChange}
                isInvalid={!!errors.pattern}
              />
              <Form.Control.Feedback type="invalid">{errors.pattern}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik02">
              <Form.Control
                type="text"
                placeholder="Query"
                name="query"
                value={values.query}
                onChange={(e) => { handleChange(e); handlePatternChange(e); }}
                isInvalid={!!errors.query}
              />
              <Form.Control.Feedback type="invalid">{errors.query}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type="submit" variant="dark">Save</Button>
        </Form>
      )}
    </Formik>
  );
}

export default PageSpecForm
