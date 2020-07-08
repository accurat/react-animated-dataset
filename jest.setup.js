import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as accurappConfig from 'jest-config-accurapp'
import * as ReactDOMTestUtils from 'react-dom/test-utils'

configure({ adapter: new Adapter() })

global.dispatch = (node, event) =>
  ReactDOMTestUtils.act(() => {
    node.dispatchEvent(event)
  })

global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  ...accurappConfig,
}
