# src

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Customize application
HADIS frontend is built dynamically from [configJSON](src/configJSON.json).

ConfigJSON form displayed bellow.
Each **groupRoute** , **groupNameMQTT** & **deviceName**(in each group) must be unique! 
**groupNameMQTT** & **deviceName** are limited to 20 characters (ASCII preferably).

```JSON
{
"groups": [
    {
      "groupRoute": "route for page",
      "groupNameMQTT": "name of group for HADIS MQTT topic",
      "groupNameDISPLAY": "group name that will be displayed",
      "components": [
        {
          "deviceName": "name of device for HADIS MQTT topic",
          "componentType": "type of component (see available bellow)"
        }
      ]
    }
  ]
}
```

### Available components

#### Dimmable Light
Control component for HADIS dimmable LED light controller.
```
componentType: DimmableLight
```

#### WIFI Switch
Control component for HADIS WIFI switch.
```
componentType: WifiSwitch
```
