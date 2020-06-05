import React, { useContext } from 'react'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import * as Yup from 'yup'
import { MatchPattern } from '../util/MatchPattern'
import { GlobalContext } from '../context/GlobalState'

const schema = Yup.object({
  pattern: Yup.string().matches(MatchPattern.MATCH_PATTERN_REGEX).required('Match pattern is required'),
  selector: Yup.string().required('Selector is required')
})

function PageSpecForm () {
  const { currentUrl, addPageSpec } = useContext(GlobalContext)

  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt)
    if (!isValid) return
    addPageSpec(evt)
  }

  const handlePatternChange = e => {
    console.log(e.target.value)
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        pattern: currentUrl && currentUrl.toString(),
        selector: ''
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
            <Form.Group as={Col} md='12' controlId='pattern'>
              <Form.Control
                type='text'
                name='pattern'
                placeholder='Matches'
                value={values.pattern || ''}
                onChange={handleChange}
                isInvalid={touched.pattern && errors.pattern}
              />
            </Form.Group>
            <Form.Group as={Col} md='12' controlId='selector'>
              <InputGroup className='mb-3'>
                <InputGroup.Prepend>
                  <InputGroup.Text id='basic-addon1'>CSS</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type='text'
                  name='selector'
                  placeholder='Selector'
                  value={values.selector || ''}
                  onChange={(e) => { handleChange(e); handlePatternChange(e) }}
                  isInvalid={touched.selector && errors.selector}
                  aria-describedby='basic-addon1'
                />
              </InputGroup>
              <Form.Control.Feedback type='invalid'>{errors.pattern}</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>{errors.selector}</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type='submit' variant='dark' style={{ marginRight: '10px' }}>Search</Button>
        </Form>
      )}
    </Formik>
  )
}

export default PageSpecForm
