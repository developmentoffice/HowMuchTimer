const path = require('path')

module.exports = {
    packagerConfig: {},
    makers: [{
        name: '@electron-forge/maker-deb',
        config: {
            options: {
                icon: path.join(__dirname, '/images/icons/512.png')
            }
        }
    }, {
        name: '@electron-forge/maker-squirrel',
        config: {
            name: 'HowMuchTimer',
            copyright: 'Alex Novikov',
            setupIcon: path.join(__dirname, '/images/icons/256.ico'),
            iconUrl: 'https://raw.githubusercontent.com/developmentoffice/HowMuchTimer/master/images/icons/256.ico'
        }
    }]
}
