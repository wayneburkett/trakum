import React, { useEffect, useState } from 'react';
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import * as Yup from "yup";
import { MatchPattern } from '../util/MatchPattern'

const schema = Yup.object({
  matchPattern: Yup.string().matches(MatchPattern.MATCH_PATTERN_REGEX).required('Match pattern is required'),
  selector: Yup.string().required("Selector is required")
});

function PageSpecForm() {
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ selector: '', matchPattern: '' }}
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
          <Form.Group as={Col} md="12" controlId="matchPattern">
            <Form.Control
              type="text"
              name="matchPattern"
              placeholder="Matches"
              value={values.matchPattern || ""}
              onChange={handleChange}
              isInvalid={touched.matchPattern && errors.matchPattern}
            />
          </Form.Group>
          <Form.Group as={Col} md="12" controlId="selector">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="selector"
                placeholder="Selector"
                value={values.selector || ""}
                onChange={handleChange}
                isInvalid={touched.selector && errors.selector}
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">{errors.matchPattern}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">{errors.selector}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Button type="submit" variant="dark" style={{ marginRight: "10px" }}>Search</Button>
      </Form>
    )}
    </Formik>
  )
}

export default PageSpecForm;
