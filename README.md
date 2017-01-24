# URBO-WATCHER

Urbo watcher module.

## Run

Standard mode:
```
$ npm run-script start
```

Debug (live-reload) mode:
```
$ npm run-script start-dev
```

Docker:
```
$ docker build -t geographica/urbo_watcher .

$ docker run -d --name='urbo_watcher' geographica/urbo_watcher npm run-script start
```

## Config file
Config file use [YAML](https://en.wikipedia.org/wiki/YAML) format.

Preparing file:
```
$ cp config.example.yml config.yml
```

Set config params:
```yaml
logging:  # Logging configuration parameters
  level: DEBUG  # Level options: INFO|ERROR|DEBUG. Default: INFO
  output: console  # Output options: console|file. Default: console

aws:
  aws_key: xxxxxxxxxxxxxxxx
  aws_secret: xxxxxxxxxx
  sns_region: xxxxxxxxxxx
  sns_arn: xxxxxxxxx

pgsql:
  host: postgis
  user: urbo_admin
  password: urbo
  database: urbo
  port: 5432

carto:
  active: true
  api_key: XXXXXXXXXX
  user: XXXXX

watcherSchedule:
  - id_watcher: myidwatcher
    table: mytable
    schema: myschema
    column: TimeInstant
    update_freq: '*/30 * * * *'
    environment: carto|pgsql|both
    threshold:
      warning: 15
      error: 30
```
