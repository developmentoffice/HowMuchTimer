export const timeFormat = (sec) => {
    const h = ('0' + Math.floor(sec / 3600)).slice(-2)
    const m = ('0' + Math.floor(sec % 3600 / 60)).slice(-2)
    const s = ('0' + Math.floor(sec % 3600 % 60)).slice(-2)
    return [h, m, s].join(':')
}
