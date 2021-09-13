# HowMuchTimer
Customizable developer timer to track time spent and money earned. Available in multiple languages.

## Installation (Deb package only)
Link: [https://github.com/developmentoffice/HowMuchTimer/releases/download/v1.0.0/howmuchtimer-1.0.0-amd64.deb](https://github.com/developmentoffice/HowMuchTimer/releases/download/v1.0.0/howmuchtimer-1.0.0-amd64.deb)

```bash
wget https://github.com/developmentoffice/HowMuchTimer/releases/download/v1.0.0/howmuchtimer-1.0.0-amd64.deb
sudo dpkg -i howmuchtimer-1.0.0-amd64.deb
howmuchtimer
```

## Screenshots
### Main screen
![Main screen](preview/main.png)

### Settings
![Settings](preview/settings.png)

### Add task
![Add task](preview/add_task.png)

### Start timer
![Add task](preview/start_timer.png)

### Stop timer
![Add task](preview/stop_timer.png)

### Statistics
![Statistics](preview/statistics.png)


## Remove
```bash
sudo dpkg -P howmuchtimer
```

## Development
`npm start` - run the main process

`npm run appwatch` - run watch and build renderer process

`npm run make` - make binary

## License
[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021, Alex Novikov
