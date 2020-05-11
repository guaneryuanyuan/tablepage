// import 'view-design/dist/styles/iview.css'
import TablePage from './components/TablePage'
function install (_Vue) {
  _Vue.component('TablePage', TablePage)
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default { install }
export { TablePage }
