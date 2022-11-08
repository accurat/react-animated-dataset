import React from 'react'
import { configure } from 'enzyme'
import Adapter16 from 'enzyme-adapter-react-16'
import Adapter17 from '@wojtekmaj/enzyme-adapter-react-17'
import * as accurappConfig from 'jest-config-accurapp'

import * as ReactDOMTestUtils from 'react-dom/test-utils'
import semver from 'semver'

const reactVersion = React.version
const Adapter = semver.lt(reactVersion, '17.0.0')
  ? Adapter16
  : semver.lt(reactVersion, '18.0.0')
  ? Adapter17
  : Adapter17

configure({ adapter: new Adapter() })

global.dispatch = (node, event) =>
  ReactDOMTestUtils.act(() => {
    node.dispatchEvent(event)
  })

global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  ...accurappConfig,
}
