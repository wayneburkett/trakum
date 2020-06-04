import React, { useEffect, useState } from "react";
import PageSpecForm from './PageSpecForm'
import { PageSpecList } from './PageSpecList'

export function BrowserAction() {
  return (
    <div className="page">
      <PageSpecList />
      <PageSpecForm />
    </div>
  );
}
