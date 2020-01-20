import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as accurappConfig from 'jest-config-accurapp'

Enzyme.configure({ adapter: new Adapter() })

export default {
  ...accurappConfig,
}
