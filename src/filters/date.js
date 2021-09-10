import moment from 'moment'

export default (value, format = 'DD.MM.YYYY HH:mm:ss') => {
    moment.locale('ru')
    return moment(String(value)).format(format)
}
