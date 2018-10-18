# URBO-WATCHER

Urbo watcher module. This module automatically sends a warning or error message when the data is not saved in our databases (Geographic and Carto ones). When the information is not saved in a logic amount of time (that depends on the provider and should be configured) warnings (first) and errors (after when the time configured is exceeded) are sent.

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

Set config params (example):

```yaml
logging:  # Logging configuration parameters
  level: DEBUG  # Level options: INFO|ERROR|DEBUG. Default: INFO
  output: console  # Output options: console|file. Default: console

email: # Email Service parameters
  server_address: smtp.xxxxxxx.xxxxxxx
  port: 587 # example port
  secure: false # true for 465, false for other ports
  user: user@example.com
  password: xxxxxxxxxxxxxx
  receivers: [
    receiver1@example.com,
    receiver2@example.com,
    receiver3@example.com,
    receiver4@example.com,
    receivern@example.com
  ]  

aws: # AWS configuration parameters
  aws_key: xxxxxxxxxxxxxxxx
  aws_secret: xxxxxxxxxx
  sns_region: xxxxxxxxxxx
  sns_arn: xxxxxxxxx

pgsql: # Historical Database configuration
  host: postgis
  user: urbo_admin
  password: urbo
  database: urbo
  port: 5432

carto: # Carto connection configuration
  active: true
  api_key: XXXXXXXXXX
  user: XXXXX

notifications: # Messages Prefix and Sender Mail Address
  subj_prefix: Urbo-Watcher
  email_address: watcher@urbo.info  

watcherSchedule: # Watchers configurations. Could be as many as necessary.
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

### MAC localhost error with Docker

Maybe configuring localhost at pgsql using Docker in conjuntion with MAC you could find a problem. In that case, use `docker.for.mac.localhost` as host of the pgsql configuration. 